"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/auth.store";
import { connectSocket, disconnectSocket, getSocket } from "@/shared/lib/socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connectSocket();
      const socket = getSocket();

      const handleNewNotification = (data: any) => {
        console.log("[Socket Notification]:", data);
      };

      socket.on("new_notification", handleNewNotification);

      return () => {
        socket.off("new_notification", handleNewNotification);
      };
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, accessToken]);

  return <>{children}</>;
}
