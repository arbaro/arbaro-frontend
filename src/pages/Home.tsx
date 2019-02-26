import React, { Component } from "react";
import {
  EmptyStateCard,
  IconFundraising,
  Text,
  ToastHub,
  Button,
  Toast
} from "@aragon/ui";
import styled from "styled-components";
import { eos } from "../index";

const randomStringGenerator = (count = 12): string => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < count; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  console.log(text);

  return `Pegl2CJHyoXS`;
};

const Container = styled.div`
  width: 1200px;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  padding: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class TokenManager extends Component {
  state = {
    authLoading: false,
    scatterLoading: false
  };

  triggerTx = async (callback: any): Promise<void> => {
    this.setState({ scatterLoading: true });
    try {
      const result = await eos.transaction("transfer", {
        to: "kaileypearce",
        from: "thekellygang",
        quantity: "0.0001 EOS",
        memo: ""
      });
      callback("Transaction Success.");
    } catch (e) {
      callback(e.message);
    }
    this.setState({ scatterLoading: false });
  };

  auth = async () => {
    this.setState({ authLoading: true });
    try {
      await eos.login();
      this.setState({ authed: true });
    } catch (e) {}
  };

  sign = async (string: string) => {
    try {
      const result = await eos.sign(string);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  donate = async () => {
    const tokenDetails = {
      contract: "eosio.token",
      symbol: "EOS",
      memo: "",
      decimals: 4
    };

    try {
      const result = await eos.donate();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <Container>
        <EmptyStateCard
          actionText="New work commit"
          text="This organisation has no work commits."
          onActivate={this.auth}
          icon={() => <IconFundraising color="blue" />}
        />
        <EmptyStateCard
          actionText="Sign"
          text="Sign bitch."
          onActivate={() => this.sign(randomStringGenerator())}
          icon={() => <IconFundraising color="blue" />}
        />
        <EmptyStateCard
          actionText="Donate"
          text="Click here to donate!"
          onActivate={this.donate}
          icon={() => <IconFundraising color="blue" />}
        />

        <ToastHub>
          <Toast>
            {(toast: any) => {
              return (
                <EmptyStateCard
                  actionText="New work commit"
                  text="Send EOS."
                  onActivate={() => this.triggerTx(toast)}
                  icon={() => <IconFundraising color="blue" />}
                />
              );
            }}
          </Toast>
        </ToastHub>
        <Text>
          {this.state.scatterLoading
            ? "Scatter Loading"
            : "Scatter not Loading"}
        </Text>
      </Container>
    );
  }
}

export default TokenManager;
