import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import { PrivateRoute, ProvideAuth } from "./utils/useAuth";

import "./App.css";

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <div className="App">
          <h1>Euthychus Project Token</h1>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}
