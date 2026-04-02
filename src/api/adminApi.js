import API from "./base.js";

// Add Admin
export const addAdmin = (data) =>
  API.post("/admin/add", data);

// Update Admin
export const updateAdmin = (id, data) =>
  API.put(`/admin/update/${id}`, data);

// Get All Admins
export const getAdmins = () =>
  API.get("/admin/fetchAll");

// Get One Admin
export const getAdminById = (id) =>
  API.get(`/admin/fetchById/${id}`);

export const deleteAdmin = (id) =>
  API.delete(`/admin/deleteById/${id}`);