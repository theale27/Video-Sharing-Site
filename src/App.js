import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./components/header";
import HomePage from "./components/HomePage";
import Video from "./components/Video";
import Profile from "./components/Profile";

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <Route path="/" exact component={HomePage} />
        <Route path="/video" component={Video} />
        <Route path="/profile" component={Profile} />
      </Router>
    );
  }
}

export default App;
