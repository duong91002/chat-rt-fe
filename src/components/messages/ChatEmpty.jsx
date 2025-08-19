import { Box, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

const ChatEmpty = ({ isMobile, onMenuClick }) => {
  return (
    <Box flexGrow={1} display="flex" flexDirection="column">
      {isMobile && (
        <Box
          px={1}
          py={2}
          bgcolor="primary.main"
          color="white"
          zIndex={10}
          display="flex"
          alignItems="center"
        >
          <IconButton onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}
      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        color="text.secondary"
        sx={{
          border: "1px dashed #ccc",
        }}
      >
        <Typography variant="h6" gutterBottom>
          No chat selected
        </Typography>
        <Typography variant="body2">
          Please select a user from the list on the left to start chatting
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatEmpty;
