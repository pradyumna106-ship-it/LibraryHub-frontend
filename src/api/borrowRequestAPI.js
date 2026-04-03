import API from "./base.js";

export const addBorrowRequest = (data) =>
  API.post("/borrowRequest/add", data);

// Update BorrowRequest
export const updateBorrowRequest = (id, data) =>
  API.put(`/borrowRequest/update/${id}`, data);

// Get All BorrowRequests
export const getBorrowRequests = () =>
  API.get("/borrowRequest/fetchAll");

// Get One BorrowRequest
export const getBorrowRequestById = (id) =>
  API.get(`/borrowRequest/fetchById/${id}`);

export const getBorrowRequestBymemberId = (memberId) =>
  API.get(`/borrowRequest/fetchByMemberId/${memberId}`);

// Delete
export const deleteBorrowRequest = (id) =>
  API.delete(`/borrowRequest/deleteById/${id}`);

export const updateRequestStatus = (id, status) =>
  API.put(`/borrowRequest/updateRequestStatus/${id}`, { status });