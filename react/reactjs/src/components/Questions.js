import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
const Questions = () => {
  const [userQuestions, setUserQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${baseURL}/getUserQuestions`, config);
        setUserQuestions(response.data);
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 403)
        ) {
          console.log(`API response status : ${error.response.status}`);
          
            const newAccessToken = await refreshToken();
            console.log("after invoking the refresh token function : " + newAccessToken)
            localStorage.setItem("token", newAccessToken);
          try {
            //repeating the original request after obtaining a new access token
            const retryResponse = await axios.get(
              `${baseURL}/getUserQuestions`,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );
            setUserQuestions(retryResponse.data);
          } catch (retryError) {
            console.log(`re-login required : Error occured while requesting resources ${retryError}`)
            localStorage.removeItem("token");
            window.location.reload();
          }
        }
      }
    };

    fetchQuestions();
  }, [localStorage.getItem("token")]);

  return (
    <div>
      <h1>Here are the available questions !</h1>
      {userQuestions.map((question, index) => {
        return (
          <>
            <h5>Question : {index + 1}</h5>
            <ul>
              <li key={index + 1}>statement : {question.statement}</li>
              <li key={index + 2}>description : {question.description}</li>
            </ul>
          </>
        );
      })}
    </div>
  );
};
export default Questions;
