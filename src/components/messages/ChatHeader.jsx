import { Avatar, Box, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

const ChatHeader = ({ isMobile, onMenuClick, userChat }) => {
  return (
    <Box
      px={isMobile ? 1 : 3}
      py={2}
      bgcolor="primary.main"
      color="white"
      zIndex={10}
      display="flex"
      alignItems="center"
    >
      {isMobile && (
        <IconButton onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
      )}
      <Avatar sx={{ mr: 1 }} />
      <Typography variant="h6">{userChat?.name}</Typography>
    </Box>
  );
};

export default ChatHeader;
