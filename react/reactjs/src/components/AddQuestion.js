import React, { Component } from "react";
import "./AddQuestion.css";
import gallery from "../utils/img/gallery.png";

const AddQuestion = ({ message }) => {
  return (
    <div className="addquestionContainer">
      <h4>Ask a public question</h4>
      <div className="writeQuestion-paragraph">
        <h5>Writing a good question</h5>
        You’re ready to ask a programming-related question and this form will
        help guide you through the process. Looking to ask a non-programming
        question? See the topics here to find a relevant site.
        <div className="steps">
          <p>Steps</p>
          <ul>
            <li>Summarize your problem in a one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Describe what you tried and what you expected to happen.</li>
            <li>Add “tags” which help surface your question.</li>
            <li>Review your question and post it to the site.</li>
          </ul>
        </div>
      </div>
      <div className="addquestionWrapper">
        <form>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Title
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              specify the poblem you're struggling with in one line.
            </div>
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Description
            </label>
            <textarea className="form-control textarea" />
          </div>
          <div className="mb-3">
            <select class="form-select" aria-label="Default select example">
              <option selected>select 3 tags as maximum</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div className="form-text">Add an screenshot (optional)</div>
          <img className="galleryLogo" src={gallery} width="40" />
          <div className="mb-3">
            {" "}
            <button type="button" className="btn btn-primary">
              create question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddQuestion;
