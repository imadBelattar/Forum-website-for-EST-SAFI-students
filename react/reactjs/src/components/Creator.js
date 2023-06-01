import React from "react";
import {FaUserCircle} from "react-icons/fa"
import "./Creator.css"

const Creator = ({creatorName}) => {
  return <div className="creator-wrapper">
   <div className="form-text" >Asked by</div> <FaUserCircle className="creator-logo"/>{creatorName}
  </div>;
};
export default Creator;
