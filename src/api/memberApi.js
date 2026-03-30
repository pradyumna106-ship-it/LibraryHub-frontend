import API from "./base.js";

// Add Member
export const addMember = (data) =>
  API.post("/member/add", data);

// Update Member
export const updateMember = (id, data) =>
  API.put(`/member/update/${id}`, data);

// Get All Members
export const getMembers = () =>
  API.get("/member/fetchAll");

// Get One Member
export const getMemberById = (id) =>
  API.get(`/member/fetchById/${id}`);

export const getMemberByEmail = (email) =>
  API.get(`/member/fetchByEmail/${email}`);

// Delete
export const deleteMember = (id) =>
  API.delete(`/member/deleteById/${id}`);

export const getMyBooks = (id) => API.get(`/member/getMyBooks/${id}`)

export const addMyBooks = (id,bookId) => API.put(`/member/addMyBooks/${id}`,{bookId})

export const getMemberCount = () => 
  API.get('/member/countAll')