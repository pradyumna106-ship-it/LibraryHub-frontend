import API from "./base";

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

// Delete
export const deleteBorrowRequest = (id) =>
  API.delete(`/borrowRequest/deleteById/${id}`);

export const updateRequestStatus = (id,status) =>
  API.put(`/borrowRequest/updateRequestStatus/${id}`,{status})