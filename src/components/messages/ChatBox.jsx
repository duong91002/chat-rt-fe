import {
  Avatar,
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Paper,
  InputBase,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import ListUserChat from "./ListUserChat";
import useAuthStore from "../../store/authStore";
import { getSocket } from "../../utils/socket";
import { createRoomApi, getListRoomsApi } from "../../services/roomService";
import { getListChatInRoomsApi } from "../../services/messageService";
import MenuIcon from "@mui/icons-material/Menu";
import ChatInput from "./ChatInput";
import ChatEmpty from "./ChatEmpty";
import ChatHeader from "./ChatHeader";
import ChatMessageItem from "./ChatMessageItem";

const ChatBox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [userChat, setUserChat] = useState(null);
  const [roomChat, setRoomChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState("first");
  const [userTyping, setUserTyping] = useState({
    senderName: "",
    isTyping: false,
  });
  const { user } = useAuthStore();
  const messageBoxRef = useRef(null);
  const bottomRef = useRef(null);

  const toolbarHeight = useMemo(() => {
    const heightHeader = isMobile ? 56 + 8 : 64 + 32;
    return heightHeader;
  }, [theme, isMobile]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getListRoomsApi();
      setRooms(data);
    };
    fetchRooms();
  }, []);

  const fetchMessages = async (loadMore = false) => {
    if (!roomChat?._id) {
      setMessages([]);
      return;
    }

    const currentPage = loadMore ? page + 1 : 1;
    const { data } = await getListChatInRoomsApi({
      roomId: roomChat._id,
      page: currentPage,
      limit: 20,
    });

    if (loadMore) {
      if (data.length === 0) setHasMore(false);
      else {
        setMessages((prev) => [...data, ...prev]);
        setPage(currentPage);
      }
    } else {
      setMessages(data);
      setPage(1);
      setHasMore(true);
    }
  };
  const parseLastMessage = (message) => {
    return {
      senderId: { _id: message.senderId },
      message: message.message,
      updatedAt: Date.now(),
    };
  };

  useEffect(() => {
    if (bottomRef.current) {
      if (isFirstLoad === "first" || isFirstLoad === "chat")
        bottomRef.current.scrollIntoView({ behavior: "auto" });
      setIsFirstLoad("stop");
    }
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (room._id === message.roomId) {
            return {
              ...room,
              lastMessage: parseLastMessage(message),
            };
          }
          return room;
        });
      });
    };

    getSocket().on("receive_message", handleReceiveMessage);

    const handleReceiveTyping = ({ senderName, isTyping }) => {
      setUserTyping({ senderName, isTyping });
    };

    getSocket().on("receive_typing", handleReceiveTyping);

    const handleNewChatUser = ({ room, message }) => {
      setRooms((prevRooms) => {
        return [
          {
            ...room,
            lastMessage: parseLastMessage(message),
          },
          ...prevRooms,
        ];
      });

      if (room._id === roomChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    getSocket().on("new_chat_user", handleNewChatUser);

    return () => {
      getSocket().off("receive_message", handleReceiveMessage);
      getSocket().off("receive_typing", handleReceiveTyping);
      getSocket().off("new_chat_user", handleNewChatUser);
    };
  }, [user?._id, roomChat?._id]);

  useEffect(() => {
    const box = messageBoxRef.current;
    if (!box) return;

    const handleScroll = async () => {
      if (box.scrollTop < 100 && hasMore && !loadingMore) {
        setLoadingMore(true);
        const oldScrollHeight = box.scrollHeight;

        await fetchMessages(true);

        setTimeout(() => {
          const newScrollHeight = box.scrollHeight;
          box.scrollTop = newScrollHeight - oldScrollHeight;
          setLoadingMore(false);
        }, 0);
      }
    };

    box.addEventListener("scroll", handleScroll);
    return () => box.removeEventListener("scroll", handleScroll);
  }, [roomChat, hasMore, loadingMore, page]);

  useEffect(() => {
    fetchMessages(false);
  }, [roomChat?._id]);
  const handleChangeText = (value) => {
    const currentlyTyping = value.trim() !== "";

    if (text.trim() !== "" && currentlyTyping) {
      setText(value);
      return;
    }

    getSocket().emit("typing", {
      roomId: roomChat?._id,
      senderName: user.name,
      isTyping: currentlyTyping,
    });
    setText(value);
  };

  const handleSetJoinRoom = async (roomId, receiverId) => {
    setIsFirstLoad("first");

    getSocket().emit("join_room", {
      roomId: roomId,
      receiverId: receiverId,
    });
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    let isNewRoom = false;
    let roomSend = roomChat;
    if (!roomSend?._id) {
      const { data } = await createRoomApi({
        users: [user._id, userChat._id],
        isGroup: false,
        createdBy: user._id,
      });
      roomSend = data;
      setRoomChat(data);
      isNewRoom = true;
    }

    const msg = {
      message: text,
      roomId: roomSend._id,
      senderId: user._id,
      receiverId: userChat._id,
      typeChat: "text",
      isNewRoom: isNewRoom,
    };
    if (!isNewRoom) {
      getSocket().emit("typing", {
        roomId: roomChat?._id,
        senderName: user.name,
        isTyping: false,
      });
    } else {
      handleSetJoinRoom(roomSend._id, userChat._id);
    }
    getSocket().emit("send_message", msg);
    if (isNewRoom) {
      setRooms((prevRooms) => {
        return [
          {
            ...roomSend,
            lastMessage: parseLastMessage(msg),
          },
          ...prevRooms,
        ];
      });
    } else {
      sortRooms(roomSend._id, parseLastMessage(msg));
    }
    setIsFirstLoad("chat");
    setText("");
  };
  const sortRooms = (roomId, lastMessage) => {
    setRooms((prevRooms) => {
      const isRoomExist = prevRooms.some((room) => room._id === roomId);

      let updatedRooms;
      if (isRoomExist) {
        updatedRooms = prevRooms.map((room) =>
          room._id === roomId ? { ...room, lastMessage } : room
        );
      } else {
        updatedRooms = [...prevRooms, { _id: roomId, lastMessage }];
      }

      return updatedRooms.sort(
        (a, b) =>
          new Date(b.lastMessage?.updatedAt || 0) -
          new Date(a.lastMessage?.updatedAt || 0)
      );
    });
  };

  const renderTyping = () => {
    if (userTyping.isTyping) {
      return (
        <Typography variant="body2" color="primary" textAlign={"end"}>
          {userTyping.senderName} đang nhập...
        </Typography>
      );
    }
    return null;
  };

  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(isMobile ? true : false);
  }, [isMobile]);
  const handleDrawer = (value) => {
    setOpen(value);
  };

  return (
    <Box
      display={"flex"}
      height={`calc(100vh - ${toolbarHeight}px)`}
      flexDirection={"row"}
    >
      {(open || !isMobile) && (
        <ListUserChat
          roomChat={roomChat}
          setUserChat={setUserChat}
          setRoomChat={setRoomChat}
          handleSetJoinRoom={handleSetJoinRoom}
          setMessages={setMessages}
          rooms={rooms}
          open={open}
          handleDrawer={handleDrawer}
          setIsFirstLoad={setIsFirstLoad}
        />
      )}

      {!open &&
        (userChat ? (
          <Box flexGrow={1} display="flex" flexDirection="column">
            <ChatHeader
              isMobile={isMobile}
              onMenuClick={handleDrawer}
              userChat={userChat}
            />

            <Box
              ref={messageBoxRef}
              flexGrow={1}
              px={3}
              py={2}
              sx={{
                overflowY: "auto",
                // backgroundColor: "#f9f9f9",
                position: "relative",
              }}
            >
              <div>
                {loadingMore && (
                  <div className="flex justify-center items-center text-center">
                    Đang tải
                    <CircularProgress size={24} style={{ marginLeft: 8 }} />
                  </div>
                )}
              </div>
              {messages.map((message, index) => (
                <ChatMessageItem
                  key={index}
                  msg={message}
                  isMobile={isMobile}
                  userId={user._id}
                />
              ))}
              <div ref={bottomRef} />
              <div className="absolute bottom-0.5 right-2">
                {renderTyping()}
              </div>
            </Box>

            <ChatInput
              text={text}
              onSend={handleSend}
              onTyping={handleChangeText}
            />
          </Box>
        ) : (
          <ChatEmpty isMobile={isMobile} onMenuClick={handleDrawer} />
        ))}
    </Box>
  );
};

export default ChatBox;
