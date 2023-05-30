import React, { useEffect, useState } from "react";
import "./ShowQuestion.css";
import { useLocation } from "react-router-dom";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
import { formatMeasurement } from "../utils/functions";
import { FaCaretSquareUp, FaCaretSquareDown } from "react-icons/fa";
import testImage from "../utils/img/testing my server's API using POSTMAN.png";
import axios from "axios";

const ShowQuestion = () => {
  //states
  const [question, setQuestion] = useState({});
  const [Asked_in, setAsked_in] = useState(0);
  const [Modified_in, setModified_in] = useState(0);
  const [Viewed, setViewed] = useState(0);
  const [tagsArray, setTagsArray] = useState([]);
  const [imagesPaths, setImagesPaths] = useState([]);
  //end of states
  const pathSplitted = useLocation().pathname.split("/");
  const shownQuestionID = pathSplitted[pathSplitted.length - 1];
  console.log("the shown question id : ", shownQuestionID);
  //useEffect hook
  useEffect(() => {
    //do stuffs
    const doStuffs = (response) => {
      setQuestion(response.data.question);
      setTagsArray(response.data.question.tags);
      setImagesPaths(response.data.question.screenshots);
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
      setViewed(response.data.question.views);
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
            Asked <b>{Asked_in === 0 ? "today" : Asked_in + " days ago"} </b>
          </div>
        </li>
        <li>
          <div className="form-text">
            Modified{" "}
            <b>{Modified_in === 0 ? "today" : Modified_in + " days ago"} </b>
          </div>
        </li>
        <li>
          <div className="form-text">
            <b>{formatMeasurement(Viewed)}</b> Viewed
          </div>
        </li>
      </ul>
      <hr />
      <div style={{ marginBottom: "25px" }}></div>
      <div className="questionDescription">
        <div className="votting">
          <ol>
            <li>
              {" "}
              <FaCaretSquareUp className="upvote" />
            </li>
            <li> {question.upvotes - question.downvotes} </li>
            <li>
              {" "}
              <FaCaretSquareDown className="downvote" />
            </li>
          </ol>
        </div>
        <div>{question.description}</div>
      </div>
      <div className="showTags">
        {tagsArray.map((tag, index) => {
          let embedded = "tagx";
          if (index === 0) embedded = "tag1";
          return (
            <button
              key={index}
              type="button"
              className={`btn btn-outline-primary ${embedded}`}>
              {tag}
            </button>
          );
        })}
      </div>
      <hr />
      <div className="screenshots-For-Question">
        <h5>screenshots :</h5>
        {imagesPaths.map((imagePath, index) => {
          console.log("map the images : ", imagePath);
          return (
            <div className="img-cover" key={index}>
              <img src={baseURL+'/'+imagePath} key={index} alt="screenshot" />
            </div>
          );
        })}
      </div>
      {/* end ************* */}
      <div className="component-before-end"></div>
    </div>
  );
};
export default ShowQuestion;
