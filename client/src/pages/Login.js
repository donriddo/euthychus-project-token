import React, { useState } from "react";
import {
  Redirect,
} from "react-router-dom";

import "../App.css";
import { useAuth } from '../utils/useAuth';

function Login() {
  let auth = useAuth();
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    name: '',
  });

  const handleChange = (event) => {
    setLoginDetails({
      ...loginDetails,
      [event.target.name]: event.target.value,
    });
  }

  const handleSubmit = (event) => {
    console.log('Form was submitted: ', loginDetails);
    event.preventDefault();
    auth.signin(loginDetails);
  }

  return auth.user
    ? <Redirect
      to={{
        pathname: "/",
        state: { from: '/login' }
      }}
    />
    : (
      <div id="login-form">
        <h4>Login</h4>
        <form onSubmit={handleSubmit}>
          <input placeholder="Full Name" name="name" type="text" value={loginDetails.name} onChange={handleChange} />
          <input placeholder="Email Address" name="email" type="email" value={loginDetails.email} onChange={handleChange} />
          <input type="submit" value="Login" />
        </form>
      </div>
    );
}

export default Login;
