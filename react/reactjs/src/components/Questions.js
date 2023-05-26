import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
import "./Questions.css";
const Questions = () => {
  const [userQuestions, setUserQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${baseURL}/getAllQuestions`, config);
        setQuestions(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log(`API response status : ${error.response.status}`);

          const newAccessToken = await refreshToken();
          console.log(
            "after invoking the refresh token function : " + newAccessToken
          );
          localStorage.setItem("token", newAccessToken);
          try {
            //repeating the original request after obtaining a new access token
            const retryResponse = await axios.get(
              `${baseURL}/getAllQuestions`,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );
            setQuestions(retryResponse.data);
          } catch (retryError) {
            console.log(
              `re-login required : Error occured while requesting resources ${retryError}`
            );
            localStorage.removeItem("token");
            window.location.reload();
          }
        }
      }
    };

    fetchQuestions();
  }, [localStorage.getItem("token")]);

/*   goAddQuestion = () => {

  } */

  return (
    <div className="questions">
      <div className="questionsHeader">
        <h3>Top Questions</h3>
        <Link to="/addQuestion" > <button className="btn btn-primary">Add question</button></Link>
      </div>
      <div className="QuestionsGroups">
        <button type="button" className="btn btn-outline-secondary info1">
          created at
        </button>
        <button type="button" className="btn btn-outline-secondary info2">
          voted
        </button>
        <button type="button" className="btn btn-outline-secondary info3">
          most viewed
        </button>
      </div>
      <Table className="table" striped>
        <tbody>
          {questions.map((question) => {
            return (
              <>
                <tr className="questionTr">
                  <td className="threeStates">
                    <ul>
                      <li>{question.upvotes - question.downvotes} votes</li>
                      <li>{question.answers.length} answers</li>
                      <li>views</li>
                    </ul>
                  </td>
                  <td className="questionStm">
                    <ul>
                      <li> {question.title}</li>
                      <li>
                      <div className="tags">
                        {question.tags.map((tag, index) => {
                          let embedded = "tagx";
                          if(index == 0) embedded = "tag1" 
                          return (
                            <button
                          type="button"
                          className={`btn btn-outline-primary ${embedded}`}>
                          {tag}
                        </button>
                          )
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
      <button type="button" className="btn btn-link">
        view more..
      </button>
    </div>
  );
};
export default Questions;
