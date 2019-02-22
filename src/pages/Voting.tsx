import React, { Component } from "react";
import {
  EmptyStateCard,
  IconPermissions,
  SidePanel,
  Text,
  Field,
  Button,
  TextInput,
  Info
} from "@aragon/ui";
import styled from "styled-components";
import { IVote, VoteStatus } from "../interfaces";
import VotingCard from "../components/VotingCard/VotingCard";
import VotingCardGroup from "../components/VotingCard/VotingCardGroup";

export const VOTE_YEA = Symbol("VOTE_YEA");
export const VOTE_NAY = Symbol("VOTE_NAY");

interface IState {
  sideBarOpened: boolean;
  txBarOpened: boolean;
  question: string;
  votes: Array<INewVote>;
}

interface INewVote {
  endDate: any;
  label: any;
  open: any;
  votingPower: any;
  status: any;
  id: any;
  yea: number;
  nay: number;
}

const votes: Array<INewVote> = [
  {
    id: 1,
    open: false,
    votingPower: 15,
    status: 1,
    endDate: new Date(2018, 11, 24, 10, 33, 30, 0),
    label: "Doing the thing and the stuff",
    yea: 5,
    nay: 6
  },
  {
    id: 2,
    open: true,
    votingPower: 5,
    status: 1,
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    label: "Touch me",
    yea: 0,
    nay: 0
  }
];

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

class Voting extends Component {
  state: IState = {
    sideBarOpened: false,
    txBarOpened: false,
    question: "",
    votes: []
  };

  draftNewPost = () => {
    this.setState({ sideBarOpened: true });
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

  transactionComplete = (vote: INewVote) => {
    this.setState((prevState: IState) => ({
      votes: [...prevState.votes, vote]
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

  sendVote = async () => {
    this.flip();
    const question: string = this.state.question;
    this.setState({ question: "" });

    // Perform transaction
    setTimeout(
      () =>
        this.transactionComplete({
          id: 3,
          open: true,
          votingPower: 5,
          status: 2,
          endDate: new Date(
            new Date().getTime() + 0.0005 * 24 * 60 * 60 * 1000
          ),
          label: question,
          yea: 0,
          nay: 0
        }),
      1500
    );
  };

  render() {
    return (
      <Container>
        {this.state.votes.length !== 0 && (
          <Button mode="strong" onClick={this.draftNewPost}>
            New
          </Button>
        )}
        {this.state.votes.length > 0 ? (
          <VotingCardGroup
            title="Votes"
            count={this.state.votes.length}
            key={"1"}
          >
            {this.state.votes.map((vote, index) => (
              <VotingCard
                width="1200px"
                key={index}
                id={index + 1}
                status={vote.open ? null : <Text>Processed</Text>}
                endDate={vote.endDate}
                open={vote.open}
                label={vote.label}
                votingPower={vote.votingPower}
                onOpen={() => console.log("fcewce")}
                options={[
                  {
                    label: this.optionLabel("Yes", vote, VOTE_YEA),
                    power: vote.yea
                  },
                  {
                    label: this.optionLabel("No", vote, VOTE_NAY),
                    power: vote.nay
                  }
                ]}
              />
            ))}
          </VotingCardGroup>
        ) : (
          <EmptyStateCard
            actionText="Create a new vote!"
            onActivate={this.draftNewPost}
            text="You seem to not have any votes."
            icon={<IconPermissions color="blue" />}
          />
        )}

        <SidePanel
          onClose={this.closeSidePanel}
          title="New Vote"
          opened={this.state.sideBarOpened}
        >
          <Info background="#ecf8fe" title="Votes are informative">
            They don't have any direct repercussion on the organisation.
          </Info>
          <Field label="Question:">
            <TextInput
              wide
              type="text"
              value={this.state.question}
              onChange={(e?: React.FormEvent<EventTarget>) => {
                let target = e!.target as HTMLInputElement;
                this.setState({ question: target.value });
              }}
            />
          </Field>
          <Button mode="strong" onClick={this.sendVote}>
            Begin Vote
          </Button>
        </SidePanel>

        <SidePanel
          onClose={this.closeTxPanel}
          title="Processing transaction.."
          opened={this.state.txBarOpened}
        >
          <Text>Waiting on Scatter transaction</Text>
        </SidePanel>
      </Container>
    );
  }
}

export default Voting;
