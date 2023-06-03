import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Creator.css";

const Creator = ({ creatorName, role, logo_color }) => {
  return (
    <div className="creator-wrapper">
      <FaUserCircle className="creator-logo" style={{color: logo_color}} />
      <div className="creator-name">{creatorName}</div>
      <div className="form-text">{role}</div>
    </div>
  );
};
export default Creator;
