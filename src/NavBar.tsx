import React, { Component } from "react";
import { Button } from "@aragon/ui";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import "./App.css";

const NavContainer = styled.div`
  display: flex;
  border-radius: 3px;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  width: 1200px;
  background: #FFFFFF
  border: 1px solid #e6e6e6;
  padding: 25px;
  margin: 25px;
`;

export default class NavBar extends Component {
  render() {
    return (
      <NavContainer>
        <NavLink className="active" exact to="/" activeClassName="selected">
          Home
        </NavLink>
        <NavLink
          className="active"
          to="/work-commits"
          activeClassName="selected"
        >
          Work Commit
        </NavLink>
        <NavLink className="active" to="/voting" activeClassName="selected">
          Voting
        </NavLink>
      </NavContainer>
    );
  }
}
