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
          Chưa chọn người chat
        </Typography>
        <Typography variant="body2">
          Vui lòng chọn một người ở danh sách bên trái để bắt đầu trò chuyện
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatEmpty;
