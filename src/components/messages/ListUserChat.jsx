import {
  Box,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  TextField,
  Paper,
  ClickAwayListener,
  ListItemButton,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import debounce from "lodash.debounce";
import { getAllUserApi } from "../../services/userService";
import useAuthStore from "../../store/authStore";
import { getRoomByIdApi } from "../../services/roomService";

const ListUserChat = ({
  roomChat,
  setUserChat,
  setRoomChat,
  handleSetJoinRoom,
  setMessages,
  rooms,
  open,
  handleDrawer,
  setIsFirstLoad,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { user } = useAuthStore();

  const fetchUsers = async (keyword) => {
    if (!keyword) {
      setUsers([]);
      return;
    }

    setLoading(true);
    const params = { name: keyword };
    try {
      const { data } = await getAllUserApi(params);
      setUsers(data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm người dùng:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRoom = async (userChoose) => {
    const { data } = await getRoomByIdApi(userChoose._id);
    setRoomChat(data);
    setIsFirstLoad("first");
  };

  const debouncedSearch = useMemo(() => debounce(fetchUsers, 500), []);
  const handleChange = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const showNameUser = (users) => {
    if (!Array.isArray(users)) return "";
    if (users.length === 1) return users[0].name;
    return users.map((u) => u.name).join(", ");
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleChooseUser = (userChoose) => {
    fetchRoom(userChoose);
    setUserChat(userChoose);
    setSearch(userChoose.name);
    setShowDropdown(false);
    handleSetJoinRoom(roomChat?._id, userChoose._id);
    setMessages([]);
    handleDrawer(false);
  };
  const handleSetChat = (data) => {
    handleSetJoinRoom(data?._id, data.users[0]?._id);
    setUserChat(data.users[0]);
    setRoomChat(data);
    handleDrawer(false);
  };
  return (
    <Box
      width={open ? "100%" : 280}
      padding={2}
      boxShadow={2}
      height="100%"
      overflow="auto"
      position={"relative"}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">Bạn bè</Typography>
        {isMobile && (
          <IconButton onClick={() => handleDrawer(false)}>
            <CloseFullscreenIcon />
          </IconButton>
        )}
      </Box>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Box position="relative">
          <TextField
            fullWidth
            placeholder="Tìm kiếm..."
            size="small"
            variant="outlined"
            value={search}
            inputRef={inputRef}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => {
              if (users?.length > 0) setShowDropdown(true);
            }}
          />

          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              maxHeight: 200,
              overflowY: "auto",
            }}
            elevation={3}
          >
            {showDropdown &&
              (loading ? (
                <Box p={2} display="flex" justifyContent="center">
                  <CircularProgress size={24} />
                </Box>
              ) : users?.length > 0 ? (
                users.map((user, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleChooseUser(user)}
                  >
                    <Avatar src={""} />
                    <Box ml={1}>
                      <Typography fontWeight="bold">{user.name}</Typography>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: isMobile ? 100 : 160,
                        }}
                        variant="body2"
                        color="gray"
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))
              ) : (
                <Box p={2}>Không tìm thấy người dùng</Box>
              ))}
          </Paper>
        </Box>
      </ClickAwayListener>

      <List>
        {rooms &&
          rooms.map((data, index) => (
            <ListItemButton
              sx={{
                paddingLeft: 0,
              }}
              key={index}
              onClick={() => handleSetChat(data)}
            >
              <Avatar src={""} />
              <Box
                ml={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "center",
                  alignItems: "flex-start",
                }}
              >
                <Typography fontWeight="bold">
                  {data.name || showNameUser(data.users)}
                </Typography>
                <Typography
                  variant="body2"
                  color="gray"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: isMobile ? 200 : 120,
                  }}
                >
                  {data?.lastMessage?.senderId?._id === user?._id
                    ? "Bạn: " + data.lastMessage.message
                    : data?.lastMessage?.message}
                </Typography>
              </Box>
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
};

export default ListUserChat;
