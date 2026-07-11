import axiosInstance from "@/shared/APIs/axiosInstance";

export async function deactivateUserApi(userId: string) {
  const response = await axiosInstance.patch(`/admin/users/${userId}/deactivate`);
  return response.data;
}

export async function reactivateUserApi(userId: string) {
  const response = await axiosInstance.patch(`/admin/users/${userId}/reactivate`);
  return response.data;
}

export async function deleteRequestAdminApi(requestId: string) {
  const response = await axiosInstance.delete(`/admin/requests/${requestId}`);
  return response.data;
}

export async function deleteUserAdminApi(userId: string) {
  const response = await axiosInstance.delete(`/admin/users/${userId}`);
  return response.data;
}

export async function deleteOfferAdminApi(offerId: string) {
  const response = await axiosInstance.delete(`/admin/offers/${offerId}`);
  return response.data;
}

export async function startAdminConversationApi(targetUserId: string) {
  const response = await axiosInstance.post(`/admin/conversations`, { targetUserId });
  return response.data?.data || response.data;
}
