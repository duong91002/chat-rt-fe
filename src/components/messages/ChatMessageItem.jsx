import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const ChatMessageItem = ({ msg, userId, isMobile }) => {
  const isMine = msg.senderId === userId;

  const renderContent = () => {
    if (msg.typeChat === "image") {
      return (
        <img
          src={msg.message}
          alt="image"
          style={{
            maxWidth: 200,
            borderRadius: 8,
            display: "block",
          }}
        />
      );
    } else if (msg.typeChat === "video") {
      return (
        <video
          src={msg.message}
          controls
          style={{
            maxWidth: 200,
            borderRadius: 8,
            display: "block",
          }}
        />
      );
    } else {
      return <Typography variant="body2">{msg.message}</Typography>;
    }
  };

  return (
    <Box
      display="flex"
      justifyContent={isMine ? "flex-end" : "flex-start"}
      mb={1.5}
    >
      {!isMine && (
        <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: 14 }} />
      )}

      <Box
        bgcolor={isMine ? "primary.main" : "grey.300"}
        color={isMine ? "white" : "black"}
        px={2}
        py={1}
        borderRadius={2}
        maxWidth={isMobile ? 200 : 500}
        sx={{ wordBreak: "break-word" }}
      >
        {renderContent()}
      </Box>

      {isMine && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            ml: 1,
            fontSize: 14,
            bgcolor: "primary.main",
          }}
        >
          M
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessageItem;
