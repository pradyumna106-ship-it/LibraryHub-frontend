import { useEffect, useState } from "react";
import { getTransactionsWithNameTitle } from "../api/transactionApi";
import {  Edit3, Trash2, Eye, BookOpen,Loader2 } from "lucide-react";

// ✅ Outside component so it persists across renders
let cache = null;

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Use cache if available
    async function fetchAll() {
      setLoading(true); // ✅ Set before fetch
          
      try {
        if (cache) {
            setTransactions(cache);
            return;
          }
        const res = await getTransactionsWithNameTitle();
        const formatted = res.data.map((txn) => ({
          ...txn,
          memberName: txn.memberName,
          bookTitle: txn.bookTitle,
        }));
        setTransactions(formatted);
        cache = formatted; // ✅ let allows reassignment
      }catch(error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []); // ✅ Hook always at top level, no conditions

  // ... rest of JSX
    if (loading) {
      return (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-6 mb-8 max-w-[1000px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br animate-pulse">
                <div className="h-full bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }
    const statusStyle = (status) => {
      if (status === "Returned") return "bg-green-100 text-green-800";
      if (status === "Overdue") return "bg-red-100 text-red-800";
      return "bg-blue-100 text-blue-800";
    };

  return (
    <div className="p-3 md:p-6 space-y-4">
 
      {/* Search + Filters */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full md:w-[300px] border rounded-full px-4 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <select className="border px-3 py-2 rounded-md text-sm flex-1 min-w-[120px]">
            <option>All</option>
            <option>Issued</option>
            <option>Returned</option>
            <option>Overdue</option>
          </select>
          <input type="date" className="border px-3 py-2 rounded-md text-sm flex-1 min-w-[130px]" />
          <input type="date" className="border px-3 py-2 rounded-md text-sm flex-1 min-w-[130px]" />
        </div>
      </div>
 
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border max-w-[1000px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((txn, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[80px]">{txn._id}</td>
                    <td className="px-4 py-3">{txn.memberName}</td>
                    <td className="px-4 py-3">{txn.bookTitle}</td>
                    <td className="px-4 py-3">{txn.issueDate}</td>
                    <td className="px-4 py-3">{txn.dueDate}</td>
                    <td className="px-4 py-3">{txn.returnDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{txn.fine}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="bg-gray-500 text-white px-2 py-1 rounded text-xs">View</button>
                      {txn.status !== "Returned" && (
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Return</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No transactions found.</p>
          </div>
        ) : (
          transactions.map((txn, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
              {/* Top row: book title + status */}
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 text-sm leading-tight">{txn.bookTitle}</p>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle(txn.status)}`}>
                  {txn.status}
                </span>
              </div>
 
              {/* Member */}
              <p className="text-xs text-gray-500">{txn.memberName}</p>
 
              {/* Dates */}
              <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-500">
                <div>
                  <p className="font-medium text-gray-700">Issued</p>
                  <p>{txn.issueDate || "—"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Due</p>
                  <p>{txn.dueDate || "—"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Returned</p>
                  <p>{txn.returnDate || "—"}</p>
                </div>
              </div>
 
              {/* Fine + Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-green-700">Fine: ₹{txn.fine ?? 0}</span>
                <div className="flex gap-2">
                  <button className="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs">View</button>
                  {txn.status !== "Returned" && (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600">Return</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Transaction;