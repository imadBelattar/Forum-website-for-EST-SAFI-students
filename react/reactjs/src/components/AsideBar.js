import React from "react";
import "./AsideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaHome, FaInfoCircle, FaCog, FaEnvelope } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const AsideBar = ({ name }) => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FontAwesomeIcon className="icon" icon={faUser} />
        <h5>Mr. {name}</h5>
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
              path === "/questions" || path === "/addQuestion"
                ? "side-actived"
                : ""
            }
            to="/questions">
            <FaInfoCircle className="sidebar-icon" />
            <span>Questions</span>
          </Link>
        </li>
        <li>
          <Link to="/userQuestions">
            <FaCog className="sidebar-icon" />
            <span>Your questions</span>
          </Link>
        </li>
        <li>
          <Link to="/changePassword">
            <FaEnvelope className="sidebar-icon" />
            <span>change password</span>
          </Link>
        </li>
        <li>
          <Link to="/about">
            <FaEnvelope className="sidebar-icon" />
            <span>about</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AsideBar;
