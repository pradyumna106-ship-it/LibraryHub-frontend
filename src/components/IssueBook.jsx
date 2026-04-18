import { useEffect, useState } from "react";
import { getBorrowRequests, updateRequestStatus } from "../api/borrowRequestAPI.js";
import { getMemberById } from "../api/memberApi";
import { getBookById } from "../api/bookApi";
import { addTransaction } from "../api/transactionApi";

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

  return (
    <div className="p-6">

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Borrow Requests
      </h1>
      {requests.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">No Borrow Requsts.</p>
        </div>
      )}
      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left">Request Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {requests.map((req,index) => (
              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="px-4 py-3">{req.memberName}</td>
                <td className="px-4 py-3">{req.bookTitle}</td>
                <td className="px-4 py-3">{req.requestDate}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    req.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : req.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {req.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 flex gap-2">
                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(req._id)} disabled={loadingIds.includes(req._id)}
                        className={`px-2 py-1 rounded text-xs text-white ${
                          loadingIds.includes(req._id)
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(req._id)} disabled={loadingIds.includes(req._id)}
                        className={`px-2 py-1 rounded text-xs text-white ${
                          loadingIds.includes(req._id)
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status !== "Pending" && (
                    <span className="text-gray-500 text-xs">
                      No Action
                    </span>
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

export default IssueBook;