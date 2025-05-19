import React, { useEffect } from "react";
import {
  sendMessageToMain,
  onReceiveMessageFromMain,
  invokeMainFunction,
} from "./utils/ipcUtils";

function MyComponent() {
  const handleClick = () => {
    sendMessageToMain("Hello from React!");
  };

  useEffect(() => {
    const unsubscribe = onReceiveMessageFromMain((message) => {
      console.log("Received message:", message);
    });

    invokeMainFunction("someArg").then((result) => {
      console.log("Result from main:", result);
    });

    return () => unsubscribe(); // 清理監聽器
  }, []);

  return (
    <div>
      <button onClick={handleClick}>Send Message</button>
    </div>
  );
}

export default MyComponent;
