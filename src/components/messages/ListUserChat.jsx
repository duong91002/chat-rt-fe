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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "@mui/material/styles";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import debounce from "lodash.debounce";
import { getAllUserApi } from "../../services/userService";
import useAuthStore from "../../store/authStore";
import { getRoomByIdApi } from "../../services/roomService";
import useMessageStore from "../../store/messageStore";
import { useRoomStore } from "../../store/roomStore";
import { showNameUser } from "../../utils";

const ListUserChat = ({ open, handleDrawer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [active, setActive] = useState(null);
  const {
    rooms,
    addRooms,
    fetchRooms: fetch,
    loading: { rooms: loadingRooms },
    setRoom,
    room,
  } = useRoomStore();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const inputRef = useRef(null);
  const { user } = useAuthStore();
  const listRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchRooms = async (loadMore = false) => {
    const currentPage = loadMore ? page + 1 : 1;
    if (rooms.length > 0 && !loadMore) return;

    const data = await fetch({
      userId: user._id,
      page: currentPage,
      limit: 20,
    });

    if (loadMore) {
      if (data.length === 0) setHasMore(false);
      else {
        addRooms(data);
        setPage(currentPage);
      }
    } else {
      setPage(1);
      setHasMore(true);
    }
  };
  useEffect(() => {
    fetchRooms(false);
  }, []);

  useEffect(() => {
    const box = listRef.current;
    if (!box) return;

    const handleScroll = async () => {
      if (
        box.scrollHeight - box.scrollTop - box.clientHeight < 50 &&
        hasMore &&
        !loadingRooms
      ) {
        await fetchRooms(true);
      }
    };
    box.addEventListener("scroll", handleScroll);
    return () => box.removeEventListener("scroll", handleScroll);
  }, [rooms, page, hasMore, loadingRooms]);

  const fetchUsers = async (keyword) => {
    if (!keyword) {
      setUsers([]);
      return;
    }

    setLoadingUsers(true);
    const params = { name: keyword };
    try {
      const { data } = await getAllUserApi(params);
      setUsers(data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRoom = async (filters) => {
    const { data } = await getRoomByIdApi(filters);
    if (data) {
      setActive(data._id);
      setRoom(data);
    } else {
      setRoom(null);
    }
  };

  const debouncedSearch = useMemo(() => debounce(fetchUsers, 500), []);
  const handleChange = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleChooseUser = (userChoose) => {
    fetchRoom({ receiverId: userChoose._id });
    setSearch(userChoose.name);
    setShowDropdown(false);
    handleDrawer(false);
  };
  const handleSetChat = (room) => {
    fetchRoom({ roomId: room._id });
    handleDrawer(false);
  };
  const getLastMessage = useCallback(
    (data) => {
      if (!data?.lastMessage) return "";

      const { typeChat, message, senderId } = data.lastMessage;

      const isMine = senderId?._id === user?._id;

      const typeLabel = {
        image: "[Image]",
        video: "[Video]",
      };

      return isMine
        ? `You: ${typeLabel[typeChat] || message}`
        : typeLabel[typeChat] || message;
    },
    [room?.lastMessage]
  );

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
        <Typography variant="h6">Friends</Typography>
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
            placeholder="Search..."
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
              (loadingUsers ? (
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
                <Box p={2}>No users found</Box>
              ))}
          </Paper>
        </Box>
      </ClickAwayListener>

      <List>
        {rooms.map((data, index) => (
          <ListItemButton
            sx={{
              backgroundColor: active === data._id ? "lightgray" : "none",
            }}
            key={index}
            onClick={() => handleSetChat(data)}
          >
            <Avatar src={""} />
            <Box ml={1} display="flex" flexDirection="column">
              <Typography fontWeight="bold">
                {data.name || showNameUser(data.users, user)}
              </Typography>
              <Typography variant="body2" color="gray" noWrap>
                {getLastMessage(data)}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
        {loadingRooms && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </List>
    </Box>
  );
};

export default ListUserChat;
