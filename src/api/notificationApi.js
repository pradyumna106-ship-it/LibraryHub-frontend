import API from "./base.js";

export const getNotifications = (role, userId) =>
  API.get("/notification/fetchAll", { params: { role, userId } });

export const markNotificationAsRead = (id) =>
  API.put(`/notification/markAsRead/${id}`);

export const markAllNotificationsAsRead = (role, userId) =>
  API.put("/notification/markAllAsRead", { role, userId });
