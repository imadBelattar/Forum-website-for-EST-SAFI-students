import React, { useEffect, useState } from "react";
import "./SelectTags.css";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { refreshToken } from "../utils/apiUtils";

const SelectTags = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${baseURL}/getTags`, config);
        setTags(response.data);
      } catch (error) {
        //token has expired
        if (error.response && error.response.status === 403) {
          console.log(`API response status : ${error.response.status}`);

          const newAccessToken = await refreshToken();
          console.log(
            "after invoking the refresh token function : " + newAccessToken
          );
          localStorage.setItem("token", newAccessToken);
          try {
            //repeating the original request after obtaining a new access token
            const retryResponse = await axios.get(`${baseURL}/getTags`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            setTags(retryResponse.data);
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
    getTags();
  }, []);

  const handleTagSelection = (event) => {
    if (selectedTags.length === 3) return;
    const selectedTag = event.target.value;
    if (selectedTag === "-- 3 tags as maximum --") return;
    console.log(selectedTag);
    const set = new Set([...selectedTags, selectedTag]);
    setSelectedTags(Array.from(set));
    console.log(selectedTags);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Select Tag</label>
      <select
        className="form-select"
        onChange={(e) => handleTagSelection(e)}
        aria-label="Default select example">
        <option>-- 3 tags as maximum --</option>
        {tags.map((tag, index) => {
          return (
            <option
              className="tag-option"
              style={{ color: tag.color }}
              value={tag.name}
              key={index}>
              {tag.name}
            </option>
          );
        })}
      </select>
      <div className="selectedTags">
        {selectedTags.map((tagName) => {
          return (
            <button type="button" className="btn btn-outline-primary tagbtn">
              {tagName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default SelectTags;
