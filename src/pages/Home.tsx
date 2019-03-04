import React, { Component } from "react";
import { Text, Table, TableHeader, TableRow, TableCell } from "@aragon/ui";
import { PieChart, Pie, Tooltip } from "recharts";
import styled from "styled-components";
import { eos } from "../index";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 }
];

interface PieRow {
  name: string;
  value: number;
}

interface WorkerInterface {
  key: string;
  payrate: number;
  roleaccepted: boolean;
  shares: number;
}

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
    scatterLoading: false,
    pieRows: []
  };

  componentDidMount() {
    this.fetchWorkersTable();
  }

  fetchWorkersTable = async () => {
    const result = await eos.getTable("workers");
    this.setState({
      pieRows: result.rows.map((worker: WorkerInterface) => ({
        name: worker.key,
        value: worker.shares
      }))
    });
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
      console.log("a");
      const { message, signature } = await eos.sign();
      console.log({ message, signature }, "passed to component.");
      const response = await fetch("http://auth.diri.chat/login", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, signature })
      }).then(res => res.json());
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <Container>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={this.state.pieRows}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
        <Table
          header={
            <TableRow>
              <TableHeader title="Team Members" />
            </TableRow>
          }
        >
          {this.state.pieRows.map((row: any, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <Text>{row.name}</Text>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Container>
    );
  }
}

export default TokenManager;
