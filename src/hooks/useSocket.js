import React, { useEffect } from "react";
import { connectSocket } from "../utils/socket";

const useSocket = () => {
  useEffect(() => {
    connectSocket();
  }, []);
};

export default useSocket;
