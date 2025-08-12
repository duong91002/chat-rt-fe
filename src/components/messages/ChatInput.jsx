import { Box, IconButton, InputBase, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";

const ChatInput = ({ text, onSend, onTyping }) => {
  return (
    <Box px={1} py={2} borderTop="1px solid #ddd" display="flex" gap={1}>
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          px: 1,
          borderRadius: 4,
          boxShadow: "none",
          border: "1px solid #ddd",
        }}
      >
        <InputBase
          sx={{ flex: 1, fontSize: 14 }}
          placeholder="Nhập tin nhắn..."
          multiline
          maxRows={4}
          value={text}
          onChange={(e) => onTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          autoFocus
        />
        <IconButton color="primary" type="submit">
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInput;
