import React from "react";
import "./AsideBar.css";
import {
  FaComments,
  FaCommentAlt,
  FaUserCircle,
  FaUserLock,
  FaClipboardCheck,
  FaBell,
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
          <Link
            className={
              path === "/questions" ||
              path === "/addQuestion" ||
              path.startsWith("/showQuestion")
                ? "side-actived"
                : ""
            }
            to="/questions">
            <FaComments className="sidebar-icon" />
            <span>Questions</span>
          </Link>
        </li>
        <li>
          <Link
            to="/userQuestions"
            className={
              path === "/userQuestions" ||
              path === "/user/addQuestion" ||
              path.startsWith("/user/showQuestion")
                ? "side-actived"
                : ""
            }>
            <FaCommentAlt className="sidebar-icon" />
            <span>My questions</span>
          </Link>
        </li>{" "}
        <li>
          <Link to="">
            <FaClipboardCheck className="sidebar-icon" />
            <span>My Answers</span>
          </Link>
        </li>
        <li>
          <Link to="">
            <FaUserLock className="sidebar-icon" />
            <span>change password</span>
          </Link>
        </li>
{/*         <li>
          <Link to="">
            <FaBell className="sidebar-icon" />
            <span>notification</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default AsideBar;
