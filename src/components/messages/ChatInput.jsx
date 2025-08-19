import { Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import React, { useRef, useState } from "react";

const ChatInput = ({ text, onSend, onTyping, onUploadFiles }) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendClick = () => {
    if (selectedFiles.length > 0) {
      onUploadFiles(selectedFiles);
      setSelectedFiles([]);
    }
    if (text.trim() !== "") {
      onSend();
    }
  };

  return (
    <Box
      px={1}
      py={2}
      borderTop="1px solid #ddd"
      display="flex"
      flexDirection="column"
      gap={1}
    >
      {selectedFiles.length > 0 && (
        <Box display="flex" gap={1} flexWrap="wrap">
          {selectedFiles.map((file, index) => {
            const isImage = file.type.startsWith("image");
            const url = URL.createObjectURL(file);

            return (
              <Box key={index} position="relative">
                {isImage ? (
                  <img
                    src={url}
                    alt={file.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <Box
                    width={80}
                    height={80}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="#ddd"
                    borderRadius={2}
                  >
                    <video
                      src={url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      controls
                      muted
                    />
                  </Box>
                )}
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    bgcolor: "white",
                  }}
                  onClick={() => handleRemoveFile(index)}
                >
                  ✕
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}

      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendClick();
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
          placeholder="Type a message..."
          multiline
          maxRows={4}
          value={text}
          onChange={(e) => onTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendClick();
            }
          }}
          autoFocus
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <IconButton
          color="primary"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <ImageIcon />
        </IconButton>
        <IconButton color="primary" type="submit">
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInput;
