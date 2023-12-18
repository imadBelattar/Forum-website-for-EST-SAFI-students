import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { formatMeasurement } from "../utils/functions";
import { refreshToken } from "../utils/apiUtils";
import { FaCheck } from "react-icons/fa";
import "./Questions.css";
const Questions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const createdAt = useRef(null);
  const voted = useRef(null);
  const viewed = useRef(null);
  const path = useLocation().pathname;
  //reset button styles
  const resetButtons = (refs) => {
    refs.forEach((ref) => {
      ref.current.style.backgroundColor = "";
      ref.current.style.color = "";
    });
  };
  //style the pressed button
  const styleButton = (ref) => {
    ref.current.style.backgroundColor = "gray";
    ref.current.style.color = "white";
  };
  const fetchQuestions = async (sortedBy) => {
    let endpoint;
    switch (sortedBy) {
      case "created at":
        resetButtons([voted, viewed]);
        endpoint = "getAllQuestions";
        styleButton(createdAt);
        break;
      case "most voted":
        resetButtons([createdAt, viewed]);
        endpoint = "getAllQuestionsByVotes";
        styleButton(voted);
        break;
      case "most viewed":
        resetButtons([createdAt, voted]);
        endpoint = "getAllQuestionsByViews";
        styleButton(viewed);
        break;
      default:
        return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/${endpoint}`, config);
      setQuestions(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const newAccessToken = await refreshToken();
        localStorage.setItem("token", newAccessToken);
        try {
          //repeating the original request after obtaining a new access token
          const retryResponse = await axios.get(`${baseURL}/${endpoint}`, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          setQuestions(retryResponse.data);
        } catch (retryError) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };
  useEffect(() => {
    fetchQuestions("created at");
  }, [localStorage.getItem("token")]);

  const conserveCurrentPath = () => {
    console.log("before", sessionStorage.getItem("path"));
    if (sessionStorage.getItem("path")) {
      sessionStorage.removeItem("path");
    }
    sessionStorage.setItem("path", path);
    console.log("after", sessionStorage.getItem("path"));
  };
  //the function responsible for showing (redirecting to) the question
  const goToQuestion = (id) => {
    conserveCurrentPath();
    localStorage.setItem("increaseViews", 1);
    navigate(`/showQuestion/${id}`);
  };

  return (
    <div className="questions">
      <div className="questionsHeader">
        <h3>Top Questions</h3>
        <Link to="/addQuestion">
          {" "}
          <button className="btn btn-primary" onClick={conserveCurrentPath}>
            Add question
          </button>
        </Link>
      </div>
      <div className="QuestionsGroups">
        <button
          ref={createdAt}
          type="button"
          onClick={() => fetchQuestions("created at")}
          className="btn btn-outline-secondary info1">
          created at
        </button>
        <button
          ref={voted}
          type="button"
          onClick={() => fetchQuestions("most voted")}
          className="btn btn-outline-secondary info2">
          voted
        </button>
        <button
          ref={viewed}
          type="button"
          onClick={() => fetchQuestions("most viewed")}
          className="btn btn-outline-secondary info3">
          most viewed
        </button>
      </div>
      <Table className="table" striped>
        <tbody>
          {questions.map((question, index) => {
            return (
              <>
                <tr key={index} className="questionTr">
                  <td className="threeStates">
                    <ul>
                      <li>
                        {formatMeasurement(
                          question.upvotes - question.downvotes
                        )}{" "}
                        votes
                      </li>
                      <li
                        className={
                          question.isAnswered
                            ? "isAnswered"
                            : question.answers.length
                            ? "isNotAnswered"
                            : ""
                        }>
                        {question.isAnswered && <FaCheck className="icon" />}
                        {formatMeasurement(
                          question.answers.length
                        )} answers{" "}
                      </li>
                      <li>{formatMeasurement(question.views)} views</li>
                    </ul>
                  </td>
                  <td className="questionStm">
                    <ul>
                      {/* when the user click the title, he will see the whole question   */}
                      {/* showQuestion component */}
                      <li
                        className="question-title"
                        onClick={() => goToQuestion(question._id)}>
                        {" "}
                        {question.title}
                      </li>
                      <li>
                        <div className="tags">
                          {question.tags.map((tag, index) => {
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
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr className="emptyTr">
                  <td></td>
                  <td></td>
                </tr>
              </>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
export default Questions;
