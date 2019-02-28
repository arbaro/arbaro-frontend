import React from "react";
import { Api, JsonRpc } from "eosjs";
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2"; // Use eosjs2 if your version of eosjs is > 16

const endpoint = "http://localhost:8888";

// Networks are used to reference certain blockchains.
// They let you get accounts and help you build signature providers.
const network = {
  blockchain: "eos",
  protocol: "http",
  host: "localhost",
  port: 8888,
  chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
};

class EOSIOClient extends React.Component {
  constructor(contractAccount) {
    super(contractAccount);
    this.contractAccount = contractAccount;
    this.rpc = new JsonRpc(endpoint);
    // Don't forget to tell ScatterJS which plugins you are using.
    ScatterJS.plugins(new ScatterEOS());

    // Can implement this into Redux using dispatch(setScatter(ScatterJS.scatter));
    try {
      ScatterJS.scatter.connect("Arbaro").then(connected => {
        // User does not have Scatter Desktop, Mobile or Classic installed.
        if (!connected) return console.log("Issue Connecting");

        window.ScatterJS = null;
        return this.login();
      });
    } catch (error) {
      console.log(error);
    }
  }

  login = async (
    requiredFields = {
      accounts: [network]
    }
  ) => {
    await ScatterJS.scatter.getIdentity(requiredFields);

    // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
    // the user for their account name beforehand. They could still give you a different account.
    this.account = ScatterJS.scatter.identity.accounts.find(
      x => x.blockchain === "eos"
    );

    // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.

    this.eos = ScatterJS.scatter.eos(network, Api, { rpc: this.rpc });
    return this.account;
  };

  getTable = async (tableName, scope = this.contractAccount) =>
    this.rpc.get_table_rows({
      json: true,
      code: this.contractAccount,
      scope,
      table: tableName,
      lower_bound: 0,
      upper_bound: -1,
      limit: 9999,
      index_position: 1
    });

  logout = () => {
    return ScatterJS.scatter.logout();
  };

  commitWork = async (dechours, notes) => {
    const { name } = this.account;
    const worker = "alice";
    return this.transaction("claimtime", { worker, dechours, notes });
  };

  sign = async () => {
    console.log(this.account, "was account");
    const {
      last_irreversible_block_id,
      last_irreversible_block_num
    } = await this.rpc.get_info();

    const shortBlockId = last_irreversible_block_id.slice(-12);
    const { publicKey, name, authority } = this.account;

    const message = `${name} would like to login using the ${authority} permission. Block ID: ${last_irreversible_block_num} ${shortBlockId}`;
    const signature = await ScatterJS.scatter.getArbitrarySignature(
      publicKey,
      message
    );
    return { message, signature };
  };

  getInfo = async () => {
    console.log(this.rpc);
    return this.rpc.get_info();
  };

  transaction = (action, data) => {
    return this.eos.transact(
      {
        actions: [
          {
            account: this.contractAccount,
            name: action,
            authorization: [
              {
                actor: this.account.name,
                permission: this.account.authority
              }
            ],
            data: {
              ...data
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
  };
}

export default EOSIOClient;
