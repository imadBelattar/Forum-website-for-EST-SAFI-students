import React from "react";
import "./QuestionAnswers.css";
import Creator from "./Creator";
import { baseURL } from "../utils/constant";
import VoteAnswer from "./VoteAnswer";

const QuestionAnswers = ({ answers }) => {
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

  return (
    <div className="question-answers-wrapper">
      {answers.map((answer) => {
        return (
          <div className="answer" key={answer._id}>
            <Creator
              creatorName={answer.answer_creator}
              logo_color={"#884A39"}
              role={"has answered " + toDays(answer.createdAt)}
            />
            {/* the answer content goes here */}
            <div className="voting-content">
              <VoteAnswer answer_id={answer._id} />
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
    </div>
  );
};
export default QuestionAnswers;
