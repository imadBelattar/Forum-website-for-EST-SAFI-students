import React, { useState } from "react";
import Navbar from "./Navbar";
import Message from "./Message";
import "./Login.css";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [retryMsg, setRetryMsg] = useState("");
  const navigate = useNavigate();

  //if the login component renders the token will be removed
  localStorage.removeItem("token");
  //handling the form submittion event
  const isAutentified = async (e) => {
    setLoginMsg("");
    setPasswordMsg("");
    setRetryMsg("");

    e.preventDefault();
    const credentials = { login, password };
    if (login && password) {
      console.log("form has submitted the credentials");
    } else {
      if (!login) {
        setLoginMsg("login is required !");
        setPassword("");
      }
      if (!password) {
        setPasswordMsg("password is required !");
      }
      return;
    }
    await axios
      .post(`${baseURL}/autentication`, credentials, {
        withCredentials: true,
      })
      .then((response) => {
        localStorage.clear();
        const recievedAccessToken = response.data.accessToken;
        if (recievedAccessToken) {
          localStorage.setItem("token", recievedAccessToken);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("currentUserId", response.data.currentUser._id);
          //get redirected to the /Question
          navigate("/questions");
        }
      })
      .catch((error) => {
        setRetryMsg("password or login is incorrect !!");
        setPassword("");
        setLogin("");
        console.error(`Error while user authentication : ${error}`);
      });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h4 className="signInMsg">sign in with your account</h4>
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
            <p className="msg">{loginMsg}</p>
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
            <p className="msg">{passwordMsg}</p>
          </div>
          <button type="submit" className="btn btn-danger signIn">
            Sign In
          </button>
        </form>
        {retryMsg && (
          <Message
            content={retryMsg}
            setUpdater={setRetryMsg}
            type={"danger"}
            topP={"20%"}
            heightP={"80px"}
          />
        )}
      </div>
    </>
  );
};

export default Login;
