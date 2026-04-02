import { useEffect } from "react";
import { useState } from "react";
import { getTransactionsWithNameTitle } from "../api/transactionApi";


function Transaction() {
  const [transactions,setTransactions] = useState([
    {
      txnId: 5001,
      member: "Pradyumna",
      book: "JavaScript",
      issueDate: "10 Mar 2026",
      dueDate: "20 Mar 2026",
      returnDate: "-",
      status: "Issued",
      fine: 0
    },
    {
      txnId: 5002,
      member: "Ram",
      book: "Python",
      issueDate: "12 Mar 2026",
      dueDate: "18 Mar 2026",
      returnDate: "-",
      status: "Overdue",
      fine: 50
    }
  ]);
 useEffect(() => {
  async function fetchAll() {
    const res = await getTransactionsWithNameTitle();
    const formatted = res.data.map((txn) => ({
      ...txn,
      memberName: txn.memberName,
      bookTitle: txn.bookTitle
    }));
      setTransactions(formatted || []);
    }
      fetchAll();
    }, []);


  return (
    <div className="p-6 space-y-6">

      {/* 🔍 Search + Filters */}
      <div className="space-y-4 max-w-[1000px]">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full md:w-[300px] border rounded-full px-4 py-2"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-4">

          <select className="border px-3 py-2 rounded-md">
            <option>All</option>
            <option>Issued</option>
            <option>Returned</option>
            <option>Overdue</option>
          </select>

          {/* Date Range */}
          <input type="date" className="border px-3 py-2 rounded-md" />
          <input type="date" className="border px-3 py-2 rounded-md" />

        </div>
      </div>

      {/* 📊 Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border max-w-[1000px]">
        <table className="w-full text-sm">

          {/* Header */}
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Txn ID</th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left">Issue Date</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Return Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Fine</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="px-4 py-3">{txn._id}</td>
                <td className="px-4 py-3">{txn.memberName}</td>
                <td className="px-4 py-3">{txn.bookTitle}</td>
                <td className="px-4 py-3">{txn.issueDate}</td>
                <td className="px-4 py-3">{txn.dueDate}</td>
                <td className="px-4 py-3">{txn.returnDate}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    txn.status === "Returned"
                      ? "bg-green-100 text-green-800"
                      : txn.status === "Overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {txn.status}
                  </span>
                </td>

                <td className="px-4 py-3">₹{txn.fine}</td>

                {/* Actions */}
                <td className="px-4 py-3 flex gap-2">

                  <button className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                    View
                  </button>

                  {txn.status !== "Returned" && (
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">
                      Return
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Transaction;