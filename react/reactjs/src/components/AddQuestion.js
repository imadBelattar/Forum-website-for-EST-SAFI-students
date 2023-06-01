import { React, useState } from "react";
import SelectTags from "./SelectTags";
import "./AddQuestion.css";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";
import Message from "./Message";
import BackwardButton from "./BackwardButton";

const AddQuestion = () => {
  //states defined for the sub-components:
  //for the imageUpload comp
  const [selectedImgFiles, setSelectedImgFiles] = useState([]);
  //for the selectTags comp
  const [selectedTags, setSelectedTags] = useState([]);
  //for this parent component
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldsRequired, setFieldsRequired] = useState("");
  const [questionCreatedMsg, setQuestionCreatedMsg] = useState("");
  //just for some tests

  //end of all states
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedTags([]);
    setSelectedImgFiles([]);
    setFieldsRequired("");
    setQuestionCreatedMsg("");
  };
  //the function used to create the new question :
  const createQuestion = async (event) => {
    event.preventDefault();
    if (!title || !description || selectedTags.length === 0) {
      setFieldsRequired("Failed! complete all the required fields");
      return;
    }
    console.log(`Question creating...`);

    const token = localStorage.getItem("token");
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("selectedTags", JSON.stringify(selectedTags));

    // Append each image file to the formData
    selectedImgFiles.forEach((file, index) => {
      formData.append("image", file);
    });

    try {
      // Send the POST request to the server
      const response = await axios.post(
        `${baseURL}/addQuestion`,
        formData,
        config
      );
      console.log("Question created:", response.data);

      // Reset the form or navigate to another page if needed
      resetForm();
      setQuestionCreatedMsg("Question created with success!");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log(`API response status: ${error.response.status}`);

        const newAccessToken = await refreshToken();
        console.log(
          "after invoking the refresh token function: " + newAccessToken
        );
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        localStorage.setItem("token", newAccessToken);
        try {
          // Retry the original request after obtaining a new access token
          const retryResponse = await axios.post(
            `${baseURL}/addQuestion`,
            formData,
            config
          );
          console.log("Question created:", retryResponse.data);
          resetForm();
          setQuestionCreatedMsg("Question created with success!");
        } catch (retryError) {
          console.log(
            `Re-login required: Error occurred while requesting resources ${retryError}`
          );
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
      console.error("Error creating question:", error);
    }
  };

  return (
    <div className="addquestionContainer">
      <BackwardButton
        linkTo={"/questions"}
      />
      <h4>Ask a public question</h4>
      <div className="writeQuestion-paragraph">
        <h5>Writing a good question</h5>
        If you're experiencing a technical issue such as a configuration
        problem, trouble with a command, encountering difficulties in your IDE ,
        or have any programming-related questions. This form is designed to
        assist you in addressing your technical concerns and guiding you through
        the troubleshooting process. Please provide as much detail as possible
        about the issue you're facing, and the community of <b>EST SAFI</b>{" "}
        students will be ready to help you find a solution.
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
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="form-text">
              specify the problem you're struggling with in one line.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <SelectTags
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <div className="form-text">Add a screenshot (optional)</div>
          {/* add image uploader here  */}
          <ImageUpload
            selectedImgFiles={selectedImgFiles}
            setSelectedImgFiles={setSelectedImgFiles}
          />
          <div className="mb-3">
            {" "}
            <button
              type="submit"
              className="btn btn-primary"
              onClick={createQuestion}>
              create question
            </button>
          </div>
        </form>
      </div>
      {(fieldsRequired || questionCreatedMsg) && (
        <Message
          content={fieldsRequired || questionCreatedMsg}
          type={fieldsRequired ? "danger" : "success"}
          setUpdater={
            fieldsRequired ? setFieldsRequired : setQuestionCreatedMsg
          }
          topP={"50%"}
          heightP={"200px"}
        />
      )}
    </div>
  );
};
export default AddQuestion;
