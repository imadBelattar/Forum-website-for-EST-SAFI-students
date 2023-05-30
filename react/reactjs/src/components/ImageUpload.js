import React, { useRef, useState } from "react";
import "./ImageUpload.css";
import gallery from "../utils/img/gallery.png";
import Message from "./Message";

const ImageUpload = ({ selectedImgFiles, setSelectedImgFiles }) => {
  const inputRef = useRef(null);
  const [screenshotsMsg, setScreenshotsMsg] = useState(null);
  const uploaderIconClicked = () => {
    inputRef.current.click();
  };

  //when the user select the images
  const whenImageSelected = (event) => {
    if (selectedImgFiles.length === 3) {
      setScreenshotsMsg("Already selected 3 screenshots");
      console.log("Already selected 3 screenshots");
      return;
    }
    const files = event.target.files;
    let images = [...selectedImgFiles];

    for (let i = 0; i < files.length; i++) {
      if (i === 3) {
        setScreenshotsMsg("Already selected 3 screenshots");
        break;
      }
      images.push(files[i]);
    }
    setSelectedImgFiles(images);
  };

  const generateSrc = (image) => {
    const src = URL.createObjectURL(image);
    console.log(src);
    return src;
  };

  return (
    <div>
      {screenshotsMsg && (
        <Message
          content={screenshotsMsg}
          type={"danger"}
          setUpdater={setScreenshotsMsg}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        onChange={whenImageSelected}
        accept="image/*"
        multiple
        hidden
      />
      <div className="form-text">
        Up to 3 screenshots{" "}
        <span style={{ color: "red" }}>
          ( {selectedImgFiles.length} screenshot(s) )
        </span>
      </div>
      <img
        className="galleryLogo"
        src={gallery}
        width="40"
        onClick={uploaderIconClicked}
      />
      {selectedImgFiles &&
        selectedImgFiles.map((image, index) => {
          return (
            <div key={index}>
              <div className="form-text">screenshot {index + 1}</div>
              <div className="displayedImage">
                <img src={generateSrc(image)} alt="Selected screenshot" />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ImageUpload;
