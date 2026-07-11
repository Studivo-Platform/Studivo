import axiosInstance from "@/shared/APIs/axiosInstance";
import { WidgetApiData } from "../types/widgetItem.type";

export async function getWidgetsApi(): Promise<WidgetApiData[]> {
  try {
    const [requestsRes, offersRes, chatRes] = await Promise.allSettled([
      axiosInstance.get("/requests/my"),
      axiosInstance.get("/offers/received"),
      axiosInstance.get("/chat/my"),
    ]);

    const requestsData = requestsRes.status === "fulfilled" ? (requestsRes.value.data?.data || requestsRes.value.data || []) : [];
    const offersData = offersRes.status === "fulfilled" ? (offersRes.value.data?.data || offersRes.value.data || []) : [];
    const chatData = chatRes.status === "fulfilled" ? (chatRes.value.data?.data || chatRes.value.data || []) : [];

    const reqList = Array.isArray(requestsData)
      ? requestsData
      : Array.isArray(requestsData?.requests)
      ? requestsData.requests
      : Array.isArray(requestsData?.docs)
      ? requestsData.docs
      : [];

    const offerList = Array.isArray(offersData)
      ? offersData
      : Array.isArray(offersData?.offers)
      ? offersData.offers
      : Array.isArray(offersData?.docs)
      ? offersData.docs
      : [];

    const chatList = Array.isArray(chatData)
      ? chatData
      : Array.isArray(chatData?.chats)
      ? chatData.chats
      : Array.isArray(chatData?.docs)
      ? chatData.docs
      : [];

    const activeRequestsCount = reqList.filter((r: any) => r.status !== "closed").length;
    const closedRequestsCount = reqList.filter((r: any) => r.status === "closed").length;
    const newOffersCount = offerList.length;
    const unreadChatsCount = chatList.reduce((acc: number, c: any) => acc + (c.unreadCount || c.unread || 0), 0);

    return [
      { id: "active_requests", value: activeRequestsCount.toString(), change: `${activeRequestsCount} Active` },
      { id: "closed_requests", value: closedRequestsCount.toString(), change: `${closedRequestsCount} Closed` },
      { id: "new_offers", value: newOffersCount.toString(), change: `${newOffersCount} Offers` },
      { id: "unread_messages", value: unreadChatsCount.toString(), change: `${unreadChatsCount} Unread` },
    ];
  } catch (error) {
    console.error("Error fetching widget stats:", error);
    return [
      { id: "active_requests", value: "0", change: "0 Active" },
      { id: "closed_requests", value: "0", change: "0 Closed" },
      { id: "new_offers", value: "0", change: "0 Offers" },
      { id: "unread_messages", value: "0", change: "0 Unread" },
    ];
  }
}