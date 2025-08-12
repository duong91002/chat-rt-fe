import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const ChatMessageItem = ({ msg, userId, isMobile }) => {
  const isMine = msg.senderId === userId;

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
        <Typography variant="body2">{msg.message}</Typography>
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
