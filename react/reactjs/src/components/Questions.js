import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
import "./Questions.css";
const Questions = () => {
  const [userQuestions, setUserQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const createdAt = useRef(null)
  const voted = useRef(null)
  const viewed = useRef(null)
  const resetButtons = (refs) => {
    refs.forEach(ref => {
      ref.current.style.backgroundColor = "";
      ref.current.style.color = "";
    });
  }
  const fetchQuestions = async (sortedBy) => {
    let endpoint
    switch (sortedBy) {
      case "created at":
        resetButtons([voted,viewed]);
        endpoint = "getAllQuestions"
        createdAt.current.style.backgroundColor = "gray";
        createdAt.current.style.color = "white";
        break;
      case "most voted":
        resetButtons([createdAt,viewed]);
        endpoint = "getAllQuestionsByVotes"
        voted.current.style.backgroundColor = "gray";
        voted.current.style.color = "white";
        break;
      case "most viewed":
        resetButtons([createdAt,voted]);
        endpoint = "getAllQuestionsByViews"
        viewed.current.style.backgroundColor = "gray";
        viewed.current.style.color = "white";
        break;
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
        console.log(`API response status : ${error.response.status}`);
                    const newAccessToken = await refreshToken();
        console.log(
          "after invoking the refresh token function : " + newAccessToken
        );
        localStorage.setItem("token", newAccessToken);
        try {
          //repeating the original request after obtaining a new access token
          const retryResponse = await axios.get(
            `${baseURL}/${endpoint}`,
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
  useEffect(() => {
    fetchQuestions("created at");
  }, [localStorage.getItem("token")]);

  return (
    <div className="questions">
      <div className="questionsHeader">
        <h3>Top Questions</h3>
        <Link to="/addQuestion" > <button className="btn btn-primary">Add question</button></Link>
      </div>
      <div className="QuestionsGroups">
        <button ref={createdAt} type="button" onClick={()=>fetchQuestions("created at")} className="btn btn-outline-secondary info1">
          created at
        </button>
        <button ref={voted} type="button" onClick={()=>fetchQuestions("most voted")} className="btn btn-outline-secondary info2">
          voted
        </button>
        <button ref={viewed} type="button" onClick={()=>fetchQuestions("most viewed")} className="btn btn-outline-secondary info3">
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
                      <li>{question.upvotes - question.downvotes} votes</li>
                      <li>{question.answers.length} answers</li>
                      <li>views</li>
                    </ul>
                  </td>
                  <td className="questionStm">
                    <ul>
                      <li className="question-title"> {question.title}</li>
                      <li>
                      <div className="tags">
                        {question.tags.map((tag, index) => {
                          let embedded = "tagx";
                          if(index === 0) embedded = "tag1" 
                          return (
                            <button key={index}
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
    </div>
  );
};
export default Questions;
