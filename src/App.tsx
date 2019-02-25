import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Main, AppView, Card } from "@aragon/ui";
import "./App.css";
import NavBar from "./NavBar";
import { Home, WorkCommits, Voting } from "./pages";

const BasicExample = () => (
  <Main>
    <Router>
      <div className="BigGuy">
        <NavBar />
        <Route exact path="/" component={Home} />
        <Route path="/work-commits" component={WorkCommits} />
        <Route path="/voting" component={Voting} />
      </div>
    </Router>
  </Main>
);
export default BasicExample;
