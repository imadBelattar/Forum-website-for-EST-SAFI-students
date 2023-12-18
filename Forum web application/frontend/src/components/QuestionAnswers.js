import React, { useState, useEffect } from "react";
import "./QuestionAnswers.css";
import Creator from "./Creator";
import { baseURL } from "../utils/constant";
import VoteAnswer from "./VoteAnswer";
import { FaPencilAlt, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { refreshToken } from "../utils/apiUtils";

const QuestionAnswers = ({
  answers,
  questionId,
  displayQuestion,
  currentUserId,
  questionCreatorId,
}) => {
  //states
  const [feedback, setFeedback] = useState("");
  //********** functions
  const toDays = (data) => {
    const inDays = Math.floor(
      (Date.now() - new Date(data)) / (1000 * 60 * 60 * 24)
    );
    if (inDays === 0) {
      return "today";
    } else if (inDays === 1) return inDays + " day ago";
    return inDays + " days ago" || "...";
  };
  const accept_answer = (id, isAccepted, question_id) => {
    setFeedback("");
    Swal.fire({
      title: "Confirmation",
      text:
        isAccepted === "accepted"
          ? "Are you sure you want to accept this answer ?"
          : "Are you sure you want to cancel this answer ?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const questionId = question_id;
        const data = {
          id,
          questionId,
          isAccepted,
        };
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        try {
          const res = await axios.put(
            `${baseURL}/answer/isAccepted`,
            data,
            config
          );
          setFeedback(res.data.feedback);
          displayQuestion();
        } catch (err) {
          if (err && err.response.status === 403) {
            const newToken = await refreshToken();
            config.headers.Authorization = `Bearer ${newToken}`;
            try {
              const res = await axios.put(
                `${baseURL}/answer/isAccepted`,
                data,
                config
              );
              setFeedback(res.data.feedback);
              displayQuestion();
            } catch (error) {
              localStorage.removeItem("token");
              window.location.reload();
            }
          }
        }
      } else {
        Swal.fire("Cancelled", "Action cancelled!", "error");
      }
    });
  };
  //useEffect hook
  useEffect(() => {
    if (feedback) {
      Swal.fire("Success", feedback, "success");
    }
  }, [feedback]);
  return (
    <div className="question-answers-wrapper">
      {answers.map((answer) => {
        return (
          <div className="answer" key={answer._id}>
            {currentUserId == answer.user._id && (
              <div className="your-answer">Your answer</div>
            )}
            <Creator
              creatorName={
                currentUserId == answer.user._id ? "" : answer.answer_creator
              }
              logo_color={"#884A39"}
              role={
                currentUserId == answer.user._id
                  ? "You have posted this answer"
                  : "has answered " + toDays(answer.createdAt)
              }
            />
            {/* the answer content goes here */}
            <div className="voting-content">
              <VoteAnswer
                answer_id={answer._id}
                creatorId={answer.user._id}
                accepted={answer.isAccepted}
              />
              {currentUserId !== answer.user._id &&
                questionCreatorId === currentUserId && (
                  <input
                    type="checkbox"
                    className="answer-checkbox"
                    checked={answer.isAccepted}
                    onChange={() =>
                      accept_answer(
                        answer._id,
                        answer.isAccepted ? "canceled" : "accepted",
                        questionId
                      )
                    }
                  />
                )}

              <div className="answer-content">
                <span>{answer.content}</span>
              </div>
            </div>

            <div className="screenshots-For-answer">
              {answer.screenshots.map((screenshotPath, index) => {
                return (
                  <div className="img-cover" key={index}>
                    <img
                      src={baseURL + "/" + screenshotPath}
                      key={index}
                      alt="answer screenshot"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {answers.length === 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h4
            style={{
              marginTop: "25px",
              color: "#FF5403",
              textAlign: "center",
            }}>
            No one has answered this question yet
          </h4>
          <FaPencilAlt style={{ fontSize: "120%", color: "#FF5403" }} />
        </div>
      )}
    </div>
  );
};
export default QuestionAnswers;
