import React, { Component } from "react";
import { EmptyStateCard, IconFundraising, Text } from "@aragon/ui";
import styled from "styled-components";

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
  render() {
    return (
      <Container>
        <EmptyStateCard
          actionText="New work commit"
          text="This organisation has no work commits."
          icon={() => <IconFundraising color="blue" />}
        />
      </Container>
    );
  }
}

export default TokenManager;
