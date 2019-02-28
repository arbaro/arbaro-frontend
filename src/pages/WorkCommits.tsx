import React, { Component, SFC } from "react";
import {
  EmptyStateCard,
  IconFundraising,
  SidePanel,
  Text,
  Field,
  Button,
  TextInput,
  TableRow,
  Table,
  TableCell,
  TableHeader,
  Countdown,
  SidePanelSplit,
  Info
} from "@aragon/ui";
import styled from "styled-components";
import { IVote, VoteStatus } from "../interfaces";
import VotingCard from "../components/VotingCard/VotingCard";
import VotingCardGroup from "../components/VotingCard/VotingCardGroup";
import { eos } from "../index";
export const VOTE_YEA = Symbol("VOTE_YEA");
export const VOTE_NAY = Symbol("VOTE_NAY");

interface IState {
  sideBarOpened: boolean;
  txBarOpened: boolean;
  notes: string;
  detailOpened: boolean;
  workDetail?: INewWorkCommit;
  decHours: number;
  workCommits: Array<INewWorkCommit>;
}

interface INewWorkCommit {
  id: number;
  decHours: number;
  notes: string;
}

const Container = styled.div`
  width: 1200px;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

interface WorkCommitRowProps {
  notes: string;
  decHours: number;
  author: string;
}

const WorkCommitRow: SFC<WorkCommitRowProps> = ({
  notes,
  decHours,
  author
}: any) => (
  <TableRow>
    <TableCell>
      <Text>{notes}</Text>
    </TableCell>
    <TableCell>
      <Text>{decHours}</Text>
    </TableCell>
    <TableCell>
      <Text>{author}</Text>
    </TableCell>
  </TableRow>
);

class WorkCommits extends Component {
  state: IState = {
    sideBarOpened: false,
    decHours: 0,
    txBarOpened: false,
    detailOpened: false,
    notes: "",
    workCommits: []
  };

  draftNewPost = () => {
    this.setState({ sideBarOpened: true });
  };

  viewVote = (id: number) => {
    this.setState((prevState: IState) => ({
      detailOpened: true,
      voteDetail: prevState.workCommits.find(workCommit => workCommit.id === id)
    }));
  };

  processScatter = () => {
    this.setState({ txBarOpened: true });
  };

  flip = () => {
    this.closeSidePanel();
    this.processScatter();
  };

  closeSidePanel = () => {
    this.setState({ sideBarOpened: false });
  };

  closeTxPanel = () => {
    this.setState({ txBarOpened: false });
  };

  closeDetailPanel = () => {
    this.setState({ detailOpened: false });
  };

  transactionComplete = (workCommit: INewWorkCommit) => {
    this.setState((prevState: IState) => ({
      workCommits: [...prevState.workCommits, workCommit]
    }));
    this.closeTxPanel();
  };

  optionLabel(label: any, vote: any, voteType: any) {
    return (
      <span>
        <span>{label}</span>
        {vote.userAccountVote === voteType && <Text>You</Text>}
      </span>
    );
  }

  sendWorkCommit = async () => {
    this.flip();
    const decHours: number = this.state.decHours;
    const notes: string = this.state.notes;
    this.setState({ decHours: 0, notes: "" });

    // Perform transaction
    const tx = await eos.commitWork(decHours, notes);
    console.log(tx);
    this.transactionComplete({
      id: 3,
      notes,
      decHours
    });
  };

  render() {
    return (
      <Container>
        {this.state.workCommits.length !== 0 && (
          <Button mode="strong" onClick={this.draftNewPost}>
            New
          </Button>
        )}
        {this.state.workCommits.length > 0 ? (
          <Table
            header={
              <TableRow>
                <TableHeader title="Activity" />
              </TableRow>
            }
          >
            <TableRow>
              <TableCell>
                <Text size="large">Notes</Text>
              </TableCell>
              <TableCell>
                <Text size="large">Dec Hours</Text>
              </TableCell>
              <TableCell>
                <Text size="large">Author</Text>
              </TableCell>
            </TableRow>
            {this.state.workCommits &&
              this.state.workCommits.map(({ notes, decHours }) => (
                <WorkCommitRow
                  notes={notes}
                  decHours={decHours}
                  author="thekellygang"
                />
              ))}
          </Table>
        ) : (
          <EmptyStateCard
            actionText="New work commit"
            text="This organisation has no work commits."
            onActivate={this.draftNewPost}
            icon={() => <IconFundraising color="blue" />}
          />
        )}

        <SidePanel
          onClose={this.closeSidePanel}
          title="New Work Commit"
          opened={this.state.sideBarOpened}
        >
          <Info background="#ecf8fe">Enter work time and notes.</Info>
          <Field label="Notes:">
            <TextInput
              wide
              type="text"
              value={this.state.notes}
              onChange={(e?: React.FormEvent<EventTarget>) => {
                let target = e!.target as HTMLInputElement;
                this.setState({ notes: target.value });
              }}
            />
          </Field>
          <Field label="Dec Hours:">
            <TextInput
              wide
              type="number"
              value={this.state.decHours}
              onChange={(e?: React.FormEvent<EventTarget>) => {
                let target = e!.target as HTMLInputElement;
                this.setState({ decHours: target.value });
              }}
            />
          </Field>
          <Button mode="strong" onClick={this.sendWorkCommit}>
            Commit Work
          </Button>
        </SidePanel>

        <SidePanel
          onClose={this.closeTxPanel}
          title="Processing transaction.."
          opened={this.state.txBarOpened}
        >
          <Text>Waiting on Scatter transaction</Text>
        </SidePanel>
        <SidePanel
          onClose={this.closeDetailPanel}
          title="Vote Detail"
          opened={this.state.detailOpened}
        >
          {this.state.workDetail && (
            <React.Fragment>
              <Text>Hello World</Text>
              <div />
            </React.Fragment>
          )}
        </SidePanel>
      </Container>
    );
  }
}

const Label = styled(Text).attrs({
  smallcaps: true
})`
  display: block;
  margin-bottom: 10px;
`;

export default WorkCommits;
