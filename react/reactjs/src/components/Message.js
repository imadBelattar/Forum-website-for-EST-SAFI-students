import React, { useEffect, useState } from "react";
import "./Message.css";

const Message = ({ content, type, setUpdater }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
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
