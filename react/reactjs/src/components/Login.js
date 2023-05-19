import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { baseURL } from "../utils/constant";

const Login = ({ setToken }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  /*   useEffect(() => {
    axios.get(`${baseURL}/authentication`);
  }, []); */

  const isAutentified = () => {
    const credentials = { login, password };
    console.log(`form submitted...`);
    axios
      .post(`${baseURL}/autentication`, credentials)
      .then((response) => {
        if (response.data.accessToken) {
          setToken(response.data.accessToken);
        }
        alert(response.data.message);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form className="loginForm" onSubmit={isAutentified}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label labelUsername">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your username"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label labelPassword">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="btn btn-danger signIn">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
