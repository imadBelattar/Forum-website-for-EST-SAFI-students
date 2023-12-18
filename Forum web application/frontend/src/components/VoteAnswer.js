import React, { useEffect, useState } from "react";
import "./VoteAnswer.css";
import { FaCaretSquareUp, FaCaretSquareDown, FaCheck } from "react-icons/fa";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
import Message from "./Message";

const VoteAnswer = ({ answer_id, creatorId, accepted }) => {
  //states
  //this state shows if is the answer already voted by the user or not
  const [votingType, setVotingType] = useState("");
  const [feedback, setFeedback] = useState("");
  const [votes, setVotes] = useState();
  //end of states
  const currentUserId = localStorage.getItem("currentUserId");
  //************functions
  const if_response_isvoted = (response) => {
    const vote_type = response.data.vote_type || "";
    const votes_number = response.data.votesNumber || 0;
    setVotingType(vote_type);
    setVotes(votes_number);
  };
  const isvoted = async () => {
    const token = localStorage.getItem("token") || null;
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${baseURL}/isAnswerVoted/${answer_id}`,
        config
      );
      if_response_isvoted(response);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newAccessToken = refreshToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        try {
          const retryResponse = await axios.get(
            `${baseURL}/isAnswerVoted/${answer_id}`,
            config
          );
          if_response_isvoted(retryResponse);
        } catch (retryErr) {
          console.log("error refreshing token ...log out", retryErr);
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };
  //
  const vote_answer_response = (res) => {
    const feedback = res.data.feedback || "Error occured";
    setFeedback(feedback);
  };
  //vote answer function
  const vote_answer = async (votingType, clicked_button) => {
    if (currentUserId && creatorId === currentUserId) {
      switch (clicked_button) {
        case "upvoteButton":
          setFeedback("You can't upvote your own answer !");
          break;
        case "downvoteButton":
          setFeedback("You can't downvote your own answer !");
          break;
      }
      return;
    }
    let action = "";
    const token = localStorage.getItem("token");
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (clicked_button === "upvoteButton") {
      if (votingType == "upvoted answer") {
        action = "cancel upvoting";
      } else {
        action = "upvote answer";
      }
    } else if (clicked_button === "downvoteButton") {
      if (votingType == "downvoted answer") {
        action = "cancel downvoting";
      } else {
        action = "downvote answer";
      }
    }

    try {
      const response = await axios.put(
        `${baseURL}/answer/votes/${answer_id}`,
        {
          action,
        },
        config
      );
      vote_answer_response(response);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = refreshToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        try {
          const retryResponse = await axios.put(
            `${baseURL}/answer/votes/${answer_id}`,
            {
              action,
            },
            config
          );
          vote_answer_response(retryResponse);
        } catch (retryErr) {
          console.log("error refreshing token ...log out", retryErr);
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
    isvoted();
  };
  //******************end of functions
  //useEffect
  useEffect(() => {
    isvoted();
  }, []);
  return (
    <>
      <div className="answer-voting-wrapper">
        <ol>
          <li>
            <FaCaretSquareUp
              className={
                votingType === "upvoted answer"
                  ? "vote-icon upvoteAnswer vote-checked"
                  : "vote-icon upvoteAnswer"
              }
              onClick={() => vote_answer(votingType, "upvoteButton")}
            />
          </li>
          <li className="answer-votes-number">{votes}</li>
          <li>
            <FaCaretSquareDown
              className={
                votingType === "downvoted answer"
                  ? "vote-icon downvoteAnswer vote-checked"
                  : "vote-icon downvoteAnswer"
              }
              onClick={() => vote_answer(votingType, "downvoteButton")}
            />
          </li>
          { accepted && <li><FaCheck className="accepted-icon"/></li>}
        </ol>
      </div>
      {feedback && (
        <Message
          content={feedback}
          type={feedback.includes("You can't") ? "danger" : "success"}
          topP={"16%"}
          heightP={"80px"}
          setUpdater={setFeedback}
        />
      )}
    </>
  );
};
export default VoteAnswer;
