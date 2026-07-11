"use client";

import { useEffect, useState } from "react";
import { getSocket, isSocketConnected } from "@/shared/lib/socket";

export function useSocket() {
  const [isConnected, setIsConnected] = useState(isSocketConnected());

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return {
    socket: getSocket(),
    isConnected,
  };
}
