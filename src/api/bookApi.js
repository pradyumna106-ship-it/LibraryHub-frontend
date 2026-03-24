import API from "./base.js";

// Add Book
export const addBook = (data) =>
  API.post("/book/add", data);

// Update Book
export const updateBook = (id, data) =>
  API.put(`/book/update/${id}`, data);

// Get All Books
export const getBooks = () =>
  API.get("/book/fetchAll");

// Get One Book
export const getBookById = (id) =>
  API.get(`/book/fetchById/${id}`);

// Delete
export const deleteBook = (id) =>
  API.delete(`/book/deleteById/${id}`);

