import React from "react";
import "./AsideBar.css";
import {
  FaHome,
  FaQuestionCircle,
  FaExclamationCircle,
  FaRegClipboard,
  FaUserCircle,
  FaUserLock
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AsideBar = ({ name }) => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FaUserCircle className="sidebar-icon user-logo" />
        <h5 className="use-name">Mr. {name}</h5>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link className={path === "/home" ? "side-actived" : ""} to="/home">
            <FaHome className="sidebar-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link
            className={
              path === "/questions" || path === "/addQuestion" || path.startsWith("/showQuestion")
                ? "side-actived"
                : ""
            }
            to="/questions">
            <FaQuestionCircle className="sidebar-icon" />
            <span>Questions</span>
          </Link>
        </li>
        <li>
          <Link to="/userQuestions">
            <FaRegClipboard className="sidebar-icon" />
            <span>Your questions</span>
          </Link>
        </li>
        <li>
          <Link to="/changePassword">
            <FaUserLock className="sidebar-icon" />
            <span>change password</span>
          </Link>
        </li>
        <li>
          <Link to="/about">
            <FaExclamationCircle className="sidebar-icon" />
            <span>about</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AsideBar;
