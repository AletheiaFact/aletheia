import React, { useEffect, useState } from "react";
import EventEmitter from "events";
import { Snackbar, Alert } from "@mui/material";

type MessageType = {
  type: "success" | "error" | "warning" | "info";
  text: string;
};

class GlobalMessageManager extends EventEmitter {
  showMessage(type: MessageType["type"], text: string) {
    this.emit("showMessage", { type, text });
  }
}

export const MessageManager = new GlobalMessageManager();

export const GlobalMessage: React.FC = () => {
  const [message, setMessage] = useState<MessageType | null>(null);

  useEffect(() => {
    const handleShowMessage = (msg: MessageType) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 3000);
    };

    MessageManager.on("showMessage", handleShowMessage);

    return () => {
      MessageManager.off("showMessage", handleShowMessage);
    };
  }, []);

  return (
    <>
      {message && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ top: "10px" }}
        >
          <Alert severity={message.type}>{message.text}</Alert>
        </Snackbar>
      )}
    </>
  );
};

