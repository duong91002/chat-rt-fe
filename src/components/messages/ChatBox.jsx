import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ListUserChat from "./ListUserChat";
import useAuthStore from "../../store/authStore";
import { getSocket } from "../../utils/socket";
import { createRoomApi, getListRoomsApi } from "../../services/roomService";
import { getListChatInRoomsApi } from "../../services/messageService";
import ChatInput from "./ChatInput";
import ChatEmpty from "./ChatEmpty";
import ChatHeader from "./ChatHeader";
import ChatMessageItem from "./ChatMessageItem";
import { uploadFilesApi } from "../../services/uploadService";
import useMessageStore from "../../store/messageStore";
import { useRoomStore } from "../../store/roomStore";
import { showNameUser } from "../../utils";

const ChatBox = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    room,
    setLastMessageInRooms,
    addRoom,
    rooms,
    loading: { messages: loadingMessages },
    fetchMessagesInRoom,
    addMessageInRoom,
    currentPageMessages,
    totalPagesMessages,
    setPaginationDefaults,
  } = useRoomStore();
  const receiver = useMemo(() => {
    if (!room) return null;
    const findUser = room.users.find(
      (u) => u._id.toString() !== user._id.toString()
    );
    return findUser;
  }, [room]);
  const [text, setText] = useState("");
  const [userTyping, setUserTyping] = useState({
    senderName: "",
    isTyping: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const messageBoxRef = useRef(null);
  const bottomRef = useRef(null);
  const toolbarHeight = useMemo(() => {
    const heightHeader = isMobile ? 56 + 8 : 64 + 32;
    return heightHeader;
  }, [theme, isMobile]);
  useEffect(() => {
    setPaginationDefaults();
    handleScrollMessage();
  }, [room?._id]);

  const fetchMessages = async () => {
    if (currentPageMessages > totalPagesMessages) {
      return;
    }
    if (!room?._id) {
      return;
    }
    const currentPage = currentPageMessages + 1;
    await fetchMessagesInRoom({
      roomId: room._id,
      page: currentPage,
      limit: 20,
    });
  };
  const handleScrollMessage = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  useEffect(() => {
    const handleReceiveMessage = ({ roomData, message }) => {
      if (room?._id === roomData._id) {
        addMessageInRoom(message);
      }
      setLastMessageInRooms(roomData, message);
    };

    getSocket().on("receive_message", handleReceiveMessage);

    const handleReceiveTyping = ({ senderName, isTyping }) => {
      setUserTyping({ senderName, isTyping });
    };

    getSocket().on("receive_typing", handleReceiveTyping);

    return () => {
      getSocket().off("receive_message", handleReceiveMessage);
      getSocket().off("receive_typing", handleReceiveTyping);
    };
  }, [user?._id, room?._id]);

  useEffect(() => {
    const box = messageBoxRef.current;
    if (!box) return;

    const handleScroll = async () => {
      if (box.scrollTop < 100 && !loadingMore && !loadingMessages) {
        setLoadingMore(true);
        const oldScrollHeight = box.scrollHeight;

        await fetchMessages();

        setTimeout(() => {
          const newScrollHeight = box.scrollHeight;
          box.scrollTop = newScrollHeight - oldScrollHeight;
          setLoadingMore(false);
        }, 0);
      }
    };

    box.addEventListener("scroll", handleScroll);

    return () => {
      box.removeEventListener("scroll", handleScroll);
    };
  }, [room, currentPageMessages, loadingMessages, loadingMore]);

  const handleChangeText = (value) => {
    const currentlyTyping = value.trim() !== "";

    if (text.trim() !== "" && currentlyTyping) {
      setText(value);
      return;
    }

    getSocket().emit("typing", {
      roomId: room?._id,
      senderName: user.name,
      isTyping: currentlyTyping,
    });
    setText(value);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    let roomSend = room;

    const msg = {
      message: text,
      roomId: roomSend._id,
      senderId: user._id,
      receiverId: receiver._id,
      typeChat: "text",
      senderName: user.name,
    };

    getSocket().emit("typing", {
      roomId: room?._id,
      senderName: user.name,
      isTyping: false,
    });

    getSocket().emit("send_message", { room: roomSend, message: msg });
    addRoom(roomSend, msg);

    handleScrollMessage();
    setText("");
  };
  const handleUploadFiles = async (files) => {
    try {
      const uploadedFiles = await uploadFilesApi(files);
      uploadedFiles.forEach((file) => {
        const msg = {
          message: file.url,
          roomId: room._id,
          senderId: user._id,
          receiverId: receiver._id,
          typeChat: "image",
          senderName: user.name,
        };
        getSocket().emit("send_message", { room: room, message: msg });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const renderTyping = () => {
    if (userTyping.isTyping && userTyping.senderName == receiver?.name) {
      return (
        <Typography variant="body2" color="primary" textAlign={"end"}>
          {userTyping.senderName} is typing...
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
        <ListUserChat rooms={rooms} open={open} handleDrawer={handleDrawer} />
      )}

      {!open &&
        (receiver && receiver._id ? (
          <Box flexGrow={1} display="flex" flexDirection="column">
            <ChatHeader
              isMobile={isMobile}
              onMenuClick={handleDrawer}
              userChat={receiver}
            />

            <Box
              ref={messageBoxRef}
              flexGrow={1}
              px={3}
              py={2}
              sx={{
                overflowY: "auto",
                position: "relative",
              }}
            >
              <div>
                {loadingMessages && (
                  <div className="flex justify-center items-center text-center">
                    Loading...
                    <CircularProgress size={24} style={{ marginLeft: 8 }} />
                  </div>
                )}
              </div>
              {room.messages.map((message, index) => (
                <ChatMessageItem
                  key={index}
                  msg={message}
                  isMobile={isMobile}
                  userId={user._id}
                />
              ))}

              <div>{renderTyping()}</div>
              <div ref={bottomRef} />
            </Box>

            <ChatInput
              text={text}
              onSend={handleSend}
              onTyping={handleChangeText}
              onUploadFiles={handleUploadFiles}
            />
          </Box>
        ) : (
          <ChatEmpty isMobile={isMobile} onMenuClick={handleDrawer} />
        ))}
    </Box>
  );
};

export default ChatBox;
