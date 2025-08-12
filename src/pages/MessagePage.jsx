import React, { use, useEffect } from "react";
import ChatBox from "../components/messages/ChatBox";
import { connectSocket } from "../utils/socket";
import Cookies from "js-cookie";
const MessagePage = () => {
  return <ChatBox />;
};

export default MessagePage;
