import { useEffect, useState } from "react";
import { getBorrowRequests, updateRequestStatus } from "../api/borrowRequestAPI.js";
import { getMemberById } from "../api/memberApi";
import { getBookById } from "../api/bookApi";
import { addTransaction } from "../api/transactionApi";
import { BookOpen } from "lucide-react";
// ✅ Outside component so it persists across renders
let cache = null;

function IssueBook() {
  const [requests, setRequests] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  // ✅ Hook always at top level — condition lives inside
  useEffect(() => {
    async function fetchRequests() {
          if (cache) {
            setRequests(cache);
            return;
          }
      const res = await getBorrowRequests();
      const requestsWithDetails = await Promise.all(
        res.data.map(async (req) => {
          const [bookRes, memberRes] = await Promise.all([
            getBookById(req.bookId),
            getMemberById(req.memberId),
          ]);
          return {
            ...req,
            memberName: memberRes.data.name,
            bookTitle: bookRes.data.title,
          };
        })
      );

      const pending = requestsWithDetails.filter(req => req.status === "Pending");
      cache = pending; // ✅ Cache the actual fetched+filtered data
      setRequests(pending);
    }

    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoadingIds(prev => [...prev, id]);
      // ✅ Create transaction only when explicitly approved
      const req = requests.find(r => r._id === id);
      await addTransaction({
        memberId: req.memberId,
        bookId: req.bookId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "Issued",
      });

      await updateRequestStatus(id, "Approved");

      // ✅ Remove from pending list (or update status)
      setRequests(prev => prev.filter(r => r._id !== id));
      cache = requests.filter(r => r._id !== id); // ✅ Keep cache in sync

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingIds(prev => [...prev, id]); // ✅ was missing

      await updateRequestStatus(id, "Rejected");
      setRequests(prev => prev.filter(r => r._id !== id));
      cache = requests.filter(r => r._id !== id); // ✅ Keep cache in sync

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id));
    }
  };

  // ... JSX unchanged
   const ActionButtons = ({ req }) => {
    const busy = loadingIds.includes(req._id);
    if (req.status !== "Pending") {
      return <span className="text-gray-400 text-xs">No Action</span>;
    }
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleApprove(req._id)}
          disabled={busy}
          className={`px-3 py-1 rounded-lg text-xs text-white font-medium transition-colors ${
            busy ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Approve
        </button>
        <button
          onClick={() => handleReject(req._id)}
          disabled={busy}
          className={`px-3 py-1 rounded-lg text-xs text-white font-medium transition-colors ${
            busy ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Reject
        </button>
      </div>
    );
  };
  return (
     <div className="p-3 md:p-6">
 
      {/* Title */}
      <h1 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6 text-gray-800 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-blue-600 shrink-0" />
        Borrow Requests
      </h1>
 
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left">Request Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                  No Borrow Requests.
                </td>
              </tr>
            ) : (
              requests.map((req, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{req.memberName}</td>
                  <td className="px-4 py-3">{req.bookTitle}</td>
                  <td className="px-4 py-3">{req.requestDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      req.status === "Pending" ? "bg-yellow-100 text-yellow-800"
                      : req.status === "Approved" ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ActionButtons req={req} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
 
      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No Borrow Requests.</p>
          </div>
        ) : (
          requests.map((req, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
              {/* Book title + status */}
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 text-sm leading-tight">{req.bookTitle}</p>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  req.status === "Pending" ? "bg-yellow-100 text-yellow-800"
                  : req.status === "Approved" ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }`}>
                  {req.status}
                </span>
              </div>
 
              {/* Member + date */}
              <div className="text-xs text-gray-500 space-y-0.5">
                <p>{req.memberName}</p>
                <p>Requested: {req.requestDate || "—"}</p>
              </div>
 
              {/* Actions */}
              <div className="pt-1">
                <ActionButtons req={req} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default IssueBook;