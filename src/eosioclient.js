import React from "react";
import { Api, JsonRpc, JsSignatureProvider } from "eosjs";
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2"; // Use eosjs2 if your version of eosjs is > 16

const endpoint = "https://nodes.get-scatter.com";

// Networks are used to reference certain blockchains.
// They let you get accounts and help you build signature providers.
const network = {
  blockchain: "eos",
  protocol: "http",
  host: "nodes.get-scatter.com",
  port: 443,
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906" // EOS Main Net
  // chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473" // Jungle
};

class EOSIOClient extends React.Component {
  constructor(contractAccount) {
    super(contractAccount);
    this.contractAccount = contractAccount;

    // Don't forget to tell ScatterJS which plugins you are using.
    ScatterJS.plugins(new ScatterEOS());

    // Can implement this into Redux using dispatch(setScatter(ScatterJS.scatter));
    try {
      ScatterJS.scatter.connect("Arbaro").then(connected => {
        // User does not have Scatter Desktop, Mobile or Classic installed.
        if (!connected) return console.log("Issue Connecting");

        window.ScatterJS = null;
      });
    } catch (error) {
      console.log(error);
    }
  }

  login = (
    requiredFields = {
      accounts: [network]
    }
  ) => {
    ScatterJS.scatter.getIdentity(requiredFields).then(accountDetails => {
      console.log(accountDetails);
      // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
      // the user for their account name beforehand. They could still give you a different account.
      this.account = ScatterJS.scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );

      // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
      const rpc = new JsonRpc(endpoint);
      this.eos = ScatterJS.scatter.eos(network, Api, { rpc });
    });
  };

  logout = () => {
    return ScatterJS.scatter.logout();
  };

  donate = () => {
    const tokenDetails = {
      contract: "eosio.token",
      symbol: "EOS",
      memo: "",
      decimals: 4
    };

    return ScatterJS.scatter.requestTransfer(
      network,
      "kaileypearce",
      0,
      tokenDetails
    );
  };

  sign = randomString => {
    return ScatterJS.scatter.getArbitrarySignature(
      "EOS6HYRAqNLg5CpZqCd2qjF6A6udx5KKTZupM9zzkuVLXoaBNohrN",
      randomString
    );
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
