import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Main, AppBar, Text, Button } from "@aragon/ui";
import "./App.css";
import NavBar from "./NavBar";
import { Home, WorkCommits, Voting } from "./pages";
import { eos } from "./index";

class App extends Component {
  state = {
    authed: false,
    accountName: null,
    scatterLoading: true
  };

  authToggle = async () => {
    if (this.state.authed) {
      this.logout();
    } else {
      this.login();
    }
  };

  login = async () => {
    const { name } = await eos.login();
    this.setState({ authed: true, accountName: name });
  };

  logout = async () => {
    eos.logout();
    this.setState({ authed: false, accountName: null });
  };

  async componentDidMount() {
    console.log(process.env, "sec");

    setTimeout(() => {
      this.login();
      this.setState({ scatterLoading: false });
    }, 500);
  }

  render() {
    const { accountName, scatterLoading } = this.state;
    if (scatterLoading) return null;
    return (
      <Main>
        <Router>
          <div className="BigGuy">
            <AppBar
              title={"Arbaro v0.1"}
              endContent={
                <div>
                  <Text>{accountName}</Text>
                  <Button onClick={this.authToggle}>
                    {this.state.authed ? "Logout" : "Login"}
                  </Button>
                </div>
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
