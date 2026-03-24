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

// Borrowed by Member
export const borrowedForOneMember = (memberId) =>
  API.get(`/transaction/borrowByMemberId/${memberId}`);

// Borrowed All
export const borrowedForAll = () =>
  API.get("/transaction/borrowAll");

// Active Loans
export const activeLoansOnePerson = (memberId) =>
  API.get(`/transaction/activeLoansByMemberId/${memberId}`);

// Full Details
export const borrowedBooksWithDetails = (memberId) =>
  API.get(`/transaction/borrowDetailsByMemberId/${memberId}`);