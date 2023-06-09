import React, { useEffect, useState } from "react";
import "./ShowQuestion.css";
import { useLocation } from "react-router-dom";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
import { formatMeasurement } from "../utils/functions";
import { FaCaretSquareUp, FaCaretSquareDown } from "react-icons/fa";
import Message from "./Message";
import BackwardButton from "./BackwardButton";
import axios from "axios";
import Creator from "./Creator";
import QuestionAnswers from "./QuestionAnswers";
import No_screenshots from "../utils/img/no-screenshots.png";
import PostAnswer from "./PostAnswer";

const ShowQuestion = () => {
  const path = sessionStorage.getItem("path") || ""
  //states
  const [question, setQuestion] = useState({});
  const [Asked_in, setAsked_in] = useState(0);
  const [Modified_in, setModified_in] = useState(0);
  const [Viewed, setViewed] = useState(0);
  const [tagsArray, setTagsArray] = useState([]);
  const [imagesPaths, setImagesPaths] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [voted, setVoted] = useState("");
  const [question_creator, setQuestion_creator] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [doesUserAnswer, setDoesUserAnswer] = useState(false);
  const [creator_id, setCreator_id] = useState();
  //end of states

  const pathSplitted = useLocation().pathname.split("/");
  const shownQuestionID = pathSplitted[pathSplitted.length - 1];
  const currentUserId = localStorage.getItem("currentUserId");
  //functions*******************************

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
    const isVoted = response.data.voted.votting_type || "";
    setVoted(isVoted);
    const creator = response.data.question.question_creator || "Guest";
    setQuestion_creator(creator);
    const resQuestionAnswers = response.data.answers || [];
    setQuestionAnswers(resQuestionAnswers);
    setDoesUserAnswer(response.data.doesUserAnswer);
    setCreator_id(response.data.question.creator_id);
  };

  //display the selected question
  const displayQuestion = async () => {
    const increaseViews = localStorage.getItem("increaseViews") || false;
    localStorage.removeItem("increaseViews");
    const id = shownQuestionID;
    const token = localStorage.getItem("token");
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "increase-views": increaseViews,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}/selectQuestion/${id}`,
        config
      );
      //do the stuffs
      doStuffs(response);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        const newAccessToken = await refreshToken();
        localStorage.setItem("token", newAccessToken);
        //re-provide the new access token within the config options of the request
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        try {
          const retryResponse = await axios.get(
            `${baseURL}/selectQuestion/${id}`,
            config
          );
          console.log("Retry response : ", retryResponse.status);
          //re-do the stuffs again
          doStuffs(retryResponse);
        } catch (RetryErr) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };

  //useEffect hook
  useEffect(() => {
    displayQuestion();
  }, []);
  //increasing the votes
  const increaseVotes = async (vote_typee, clicked_button) => {
    if (currentUserId && creator_id === currentUserId) {
      switch (clicked_button) {
        case "upvoteBtn":
          setFeedback("You can't upvote your own question !");
          break;
        case "downvoteBtn":
          setFeedback("You can't downvote your own question !");
          break;
      }
      return;
    }
    let vote_type = vote_typee;
    if (voted && voted === "already upvoted") {
      if (vote_type === "upvote") {
        vote_type = "remove upvote";
      }
    }
    if (voted && voted === "already downvoted") {
      if (vote_type === "downvote") {
        vote_type = "remove downvote";
      }
    }
    const id = shownQuestionID;
    const token = localStorage.getItem("token");
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `${baseURL}/increase/questionVotes/${id}`,
        { vote_type },
        config
      );
      const resFeedback = response.data.feedback;
      if (resFeedback) {
        setFeedback(resFeedback);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        const newAccessToken = await refreshToken();
        localStorage.setItem("token", newAccessToken);
        //re-provide the new access token within the config options of the request
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        try {
          const retryResponse = await axios.put(
            `${baseURL}/increase/questionVotes/${id}`,
            { vote_type },
            config
          );
          const resFeedback = retryResponse.data.feedback;
          if (resFeedback) {
            setFeedback(resFeedback);
          }
        } catch (retryErr) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
    displayQuestion();
  };
  return (
    <div className="selectedQuestion-wrapper">
      <BackwardButton linkTo={path} />
      <Creator
        creatorName={
          creator_id === currentUserId ? "You have" : question_creator
        }
        role={"posted this question"}
        logo_color={"#F97B22"}
      />
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
              <FaCaretSquareUp
                onClick={() => increaseVotes("upvote", "upvoteBtn")}
                className={
                  voted === "already upvoted"
                    ? "vote-icon upvote vote-checked"
                    : "vote-icon upvote"
                }
              />
            </li>
            <li className="votes-number">
              {" "}
              {question.upvotes - question.downvotes}{" "}
            </li>
            <li>
              {" "}
              <FaCaretSquareDown
                className={
                  voted === "already downvoted"
                    ? "vote-icon downvote vote-checked"
                    : "vote-icon downvote"
                }
                onClick={() => increaseVotes("downvote", "downvoteBtn")}
              />
            </li>
          </ol>
        </div>
        <div className="real-description">
          <span>{question.description}</span>
        </div>
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
      <div className="screenshots-For-Question">
        <h5>screenshots :</h5>
        {imagesPaths.length > 0 &&
          imagesPaths.map((imagePath, index) => {
            return (
              <div className="img-cover" key={index}>
                <img
                  src={baseURL + "/" + imagePath}
                  key={index}
                  alt="screenshot"
                />
              </div>
            );
          })}
        {!imagesPaths.length && (
          <div className="no-screenshot">
            <img src={No_screenshots} />
          </div>
        )}
      </div>

      <hr />
      <div className="Answers-term">
        <h5>Answers :</h5>
      </div>
      <QuestionAnswers answers={questionAnswers} questionId={question._id} displayQuestion={displayQuestion} currentUserId={currentUserId}
        questionCreatorId={question.creator_id}
      />

      {!doesUserAnswer && creator_id !== currentUserId && (
        <PostAnswer
          questionId={shownQuestionID}
          reShowQuestion={displayQuestion}
        />
      )}
      {/* end ************* */}
      <div className="component-before-end"></div>
      {feedback && (
        <Message
          content={feedback}
          type={creator_id === currentUserId ? "danger" : "primary"}
          topP={"16%"}
          heightP={"80px"}
          setUpdater={setFeedback}
        />
      )}
    </div>
  );
};
export default ShowQuestion;
