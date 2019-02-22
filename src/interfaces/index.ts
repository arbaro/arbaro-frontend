export enum VoteStatus {
  InProgress,
  Failed,
  Passed
}

export interface IVote {
  question: string;
  asker: string;
  votesYes: number;
  votesNo: number;
  status: VoteStatus;
}
