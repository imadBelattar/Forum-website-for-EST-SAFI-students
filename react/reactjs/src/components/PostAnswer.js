import React from "react";
import "./PostAnswer.css";
import ImageUpload from "./ImageUpload";
import { useState } from "react";
import { refreshToken } from "../utils/apiUtils";
import axios from "axios";
import { baseURL } from "../utils/constant";
import Message from "./Message";

const PostAnswer = ({ questionId, reShowQuestion }) => {
  //for the imageUpload comp
  const [selectedImgFiles, setSelectedImgFiles] = useState([]);
  const [content, setContent] = useState("");
  const [postingMessage, setPostingMessage] = useState("");
  //**************functions
  const post_answer = async () => {
    if (!content) {
      setPostingMessage("The answer's content is required !");
      return;
    }
    const formData = new FormData();
    formData.append("content", content);
    formData.append("questionId", questionId);
    for (let i = 0; i < selectedImgFiles.length; i++) {
      formData.append("image", selectedImgFiles[i]);
    }
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}/postAnswer`,
        formData,
        config
      );
      setPostingMessage(response.data.message);
      //retrieving the current question after adding the new answer
      reShowQuestion();
      setContent("");
      setSelectedImgFiles([]);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setPostingMessage("Error while failed to save the answer");
      }
      if (err.response && err.response.status === 401) {
        try {
          const newAccessToken = await refreshToken();
          localStorage.setItem("token", newAccessToken);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          const retryResponse = await axios.post(
            `${baseURL}/postAnswer`,
            formData,
            config
          );
          setPostingMessage(retryResponse.data.message);
          reShowQuestion();
          setContent("");
          setSelectedImgFiles([]);
        } catch (err) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };

  return (
    <div className="postAnswer-wrapper">
      <div className="post-answer-header">
        <h5 style={{ marginBottom: "25px" }}>Your answer</h5>
        <button className="btn btn-success" onClick={() => post_answer()}>
          Post answer
        </button>
      </div>

      <form>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            type="text"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <ImageUpload
            selectedImgFiles={selectedImgFiles}
            setSelectedImgFiles={setSelectedImgFiles}
          />
        </div>
      </form>
      {postingMessage && (
        <Message
          content={postingMessage}
          heightP={postingMessage.includes("successfully") ? "80px" : "200px"}
          setUpdater={setPostingMessage}
          topP={postingMessage.includes("successfully") ? "16%" : "50%"}
          type={postingMessage.includes("successfully") ? "success" : "danger"}
        />
      )}
    </div>
  );
};
export default PostAnswer;
