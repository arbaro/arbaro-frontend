import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Main, AppBar, Card, Button } from "@aragon/ui";
import "./App.css";
import NavBar from "./NavBar";
import { Home, WorkCommits, Voting } from "./pages";
import { eos } from "./index";

class App extends Component {
  state = {
    authed: false,
    accountName: null
  };

  authToggle = () => {
    if (this.state.authed) {
      eos.logout();
      this.setState({ authed: false });
    } else {
      eos.login();
    }
  };

  render() {
    const { accountName } = this.state;

    return (
      <Main>
        <Router>
          <div className="BigGuy">
            <AppBar
              title={accountName || "Not logged in"}
              endContent={
                <Button onClick={this.authToggle}>
                  {this.state.authed ? "Logout" : "Login"}
                </Button>
              }
            />
            <NavBar />
            <Route exact path="/" component={Home} />
            <Route path="/work-commits" component={WorkCommits} />
            <Route path="/voting" component={Voting} />
          </div>
        </Router>
      </Main>
    );
  }
}
export default App;
