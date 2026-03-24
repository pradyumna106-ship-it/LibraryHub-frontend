import API from "./base.js";

// Add Publisher
export const addPublisher = (data) =>
  API.post("/publisher/add", data);

// Update Publisher
export const updatePublisher = (id, data) =>
  API.put(`/publisher/update/${id}`, data);

// Get All Publishers
export const getPublishers = () =>
  API.get("/publisher/fetchAll");

// Get One Publisher
export const getPublisherById = (id) =>
  API.get(`/publisher/fetchById/${id}`);

// Delete
export const deletePublisher = (id) =>
  API.delete(`/publisher/deleteById/${id}`);

