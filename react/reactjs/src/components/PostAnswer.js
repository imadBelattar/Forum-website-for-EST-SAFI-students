import React from "react";
import "./PostAnswer.css";
import ImageUpload from "./ImageUpload";
import { useState } from "react";

const PostAnswer = () => {
  //for the imageUpload comp
  const [selectedImgFiles, setSelectedImgFiles] = useState([]);

  return (
    <div className="postAnswer-wrapper">
      <div className="post-answer-header">
        <h5 style={{ marginBottom: "25px" }}>Your answer</h5>
        <button className="btn btn-success">Post answer</button>
      </div>

      <form>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea type="text" className="form-control" />
          <ImageUpload
            selectedImgFiles={selectedImgFiles}
            setSelectedImgFiles={setSelectedImgFiles}
          />
        </div>
      </form>
    </div>
  );
};
export default PostAnswer;
