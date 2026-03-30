import API from "./base";

// Add Transaction
export const addTransaction = (data) =>
  API.post("/transaction/add", data);

// Update Transaction
export const updateTransaction = (id, data) =>
  API.put(`/transaction/update/${id}`, data);

// Get All Transactions
export const getTransactions = () =>
  API.get("/transaction/fetchAll");

// Get One Transaction
export const getTransactionById = (id) =>
  API.get(`/transaction/fetchById/${id}`);

// Delete
export const deleteTransaction = (id) =>
  API.delete(`/transaction/deleteById/${id}`);

// Borrow Count
export const borrowedForOneMember = (memberId) =>
  API.get(`/transaction/borrowByMemberId/${memberId}`);

// History
export const getHistoryByMember = (memberId) =>
  API.get(`/transaction/historyByMemberId/${memberId}`);

// Borrowed Books Details
export const getBorrowedBooksDetails = (memberId) =>
  API.get(`/transaction/borrowDetailsByMemberId/${memberId}`);

// Dashboard Stats
export const getDashboardStats = (memberId) =>
  API.get(`/transaction/dashboardStats/${memberId}`);

export const getIssuedCount = () => 
  API.get('/transaction/countAll')

export const approvedRequest = (id) =>
  API.get(`/transaction/approveRequest/${id}`)