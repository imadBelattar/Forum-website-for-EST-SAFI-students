import React from "react";
import "./BackwardButton.css";
import { Link } from "react-router-dom";
import {FaArrowAltCircleLeft} from "react-icons/fa"

const BackwardButton = ({linkTo }) => {
  return (
    <div className="backward-btn">
      <Link to={linkTo}>
       <FaArrowAltCircleLeft className="icon"/>
      </Link>
    </div>
  );
};
export default BackwardButton;
