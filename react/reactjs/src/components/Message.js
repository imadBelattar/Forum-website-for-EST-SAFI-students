import React, { useEffect, useState } from "react";
import "./Message.css";

const Message = ({ content, type, setUpdater }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      //this updater contain the message content and
      //responsible for showing the message component
      //it comes from the parent
      if (setUpdater) setUpdater(null);
    }, 1850);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`alert alert-${type} MessageContent`} role="alert">
      {content}
    </div>
  );
};

export default Message;
