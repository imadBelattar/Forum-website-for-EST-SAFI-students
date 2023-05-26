import React from "react";
import "./AsideBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FaHome, FaInfoCircle, FaCog, FaEnvelope } from 'react-icons/fa';

const AsideBar = ({name}) => {
  return (
<div className="sidebar">
      <div className="sidebar-header">
      <FontAwesomeIcon className="icon" icon={faUser} />
        <h5>Mr. {name}</h5>
      </div>
      <ul className="sidebar-menu">
        <li>
          <a href="#">
            <FaHome className="sidebar-icon" />
            <span>Home</span>
          </a>
        </li>
        <li>
          <a href="#">
            <FaInfoCircle className="sidebar-icon" />
            <span>About</span>
          </a>
        </li>
        <li>
          <a href="#">
            <FaCog className="sidebar-icon" />
            <span>Settings</span>
          </a>
        </li>
        <li>
          <a href="#">
            <FaEnvelope className="sidebar-icon" />
            <span>Contact</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AsideBar;
