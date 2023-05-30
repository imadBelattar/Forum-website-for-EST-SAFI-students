import React, { useEffect, useState } from "react";
import "./ShowQuestion.css";
import { useLocation } from "react-router-dom";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
import axios from "axios";

const ShowQuestion = () => {
  //states
  const [question, setQuestion] = useState({});
  const [Asked_in, setAsked_in] = useState(0);
  const [Modified_in, setModified_in] = useState(0);
  const [Viewed, setViewed] = useState(0);
  //end of states
  const pathSplitted = useLocation().pathname.split("/");
  const shownQuestionID = pathSplitted[pathSplitted.length - 1];
  console.log("the shown question id : ", shownQuestionID);
  //useEffect hook
  useEffect(() => {
    //do stuffs
    const doStuffs = (response) => {
      setQuestion(response.data.question);
      const createdAt = response.data.question.createdAt;
      let daysAgo = Math.floor(
        (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24)
      );
      setAsked_in(daysAgo);
      const updatedAt = response.data.question.updatedAt;
      daysAgo = Math.floor(
        (Date.now() - new Date(updatedAt)) / (1000 * 60 * 60 * 24)
      );
      setModified_in(daysAgo);
      setViewed(response.data.question.views)
    };
    //display the selected question
    const displayQuestion = async () => {
      const id = shownQuestionID;
      const token = localStorage.getItem("token");
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${baseURL}/selectQuestion/${id}`,
          config
        );
        console.log(response.status);
        //do the stuffs
        doStuffs(response);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          const newAccessToken = await refreshToken();
          localStorage.setItem("token", newAccessToken);
          //re-provide the new access token within the config options of the request
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          try {
            const RetryResponse = await axios.get(
              `${baseURL}/selectQuestion/${id}`,
              config
            );
            console.log("Retry response : ", RetryResponse.status);
            //re-do the stuffs again
            doStuffs(RetryResponse);
          } catch (RetryErr) {
            localStorage.removeItem("token");
            window.location.reload();
          }
        }
      }
    };
    displayQuestion();
  }, []);

  return (
    <div className="selectedQuestion-wrapper">
      <h4>{question.title}</h4>
      <ul>
        <li>
          <div className="form-text">
            Asked <b>{Asked_in} days ago </b>
          </div>
        </li>
        <li>
          <div className="form-text">
            Modified <b>{Modified_in} days ago </b>
          </div>
        </li>
        <li>
          <div className="form-text"><b>{Viewed}</b> Viewed</div>
        </li>
      </ul>
    </div>
  );
};
export default ShowQuestion;
