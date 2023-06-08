import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { baseURL } from "../../utils/constant";
import { formatMeasurement } from "../../utils/functions";
import { refreshToken } from "../../utils/apiUtils";
import { FaCheck } from "react-icons/fa";
import "./UserQuestions.css";
const UserQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const path = useLocation().pathname;
  //style the pressed button
  const set_token_config = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return config;
  };
  //retrieve the user question from the API
  const fetchUserQuestion = async () => {
    const config = set_token_config();
    try {
      const res = await axios.get(`${baseURL}/userQuestions`, config);
      setQuestions(res.data);
    } catch (err) {
      if (err && err.response.status === 403) {
        const newToken = await refreshToken();
        try {
          config.headers.Authorization = `Bearer ${newToken}`;
          const res = await axios.get(`${baseURL}/useQuestions`, config);
          setQuestions(res.data);
        } catch (err) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };


  useEffect(() => {
    fetchUserQuestion();
  }, []);
  //conserving path when going to add a new question
  const conserveCurrentPath = () => {
    if (sessionStorage.getItem("path")) {
      sessionStorage.removeItem("path");
    }
    sessionStorage.setItem("path", path);
  };
  //go to question
  const goToQuestion = (id) => {
    conserveCurrentPath()
    navigate(`/user/showQuestion/${id}`);
  };
  return (
    <div className="questions">
      <div className="questionsHeader">
        <h3>your Questions</h3>

        <Link to="/user/addQuestion">
          {" "}
          <button
            className="btn btn-primary"
            onClick={conserveCurrentPath}>
            Add question
          </button>
        </Link>
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
export default UserQuestions;
