import React from "react";
import './Login.css'

const Login = () => {

return (
<div className="container">
      <h2>Login</h2>
      <form className="loginForm">
        <div className="mb-3">
          <label htmlFor="username" className="form-label labelUsername">Username</label>
          <input type="text" className="form-control" id="username" placeholder="Enter your username" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label labelPassword">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Enter your password" />
        </div>
        <button type="submit" className="btn btn-success signIn">Sign In</button>
      </form>
    </div>
);



};
export default Login;