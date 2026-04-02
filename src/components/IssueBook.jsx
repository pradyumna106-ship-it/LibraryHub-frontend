import { useEffect, useState } from "react";
import { getBorrowRequests, updateBorrowRequest } from "../api/borrowRequestAPI";
import { getMemberById } from "../api/memberApi";
import { getBookById } from "../api/bookApi";
import { addTransaction } from "../api/transactionApi";

function IssueBook() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      memberName: "Pradyumna",
      bookTitle: "JavaScript Basics",
      requestDate: "10 Mar 2026",
      status: "Pending"
    },
    {
      id: 2,
      memberName: "Ram",
      bookTitle: "Python Guide",
      requestDate: "11 Mar 2026",
      status: "Pending"
    }
  ]);
  const [loadingIds, setLoadingIds] = useState([]);
  useEffect(() => {
    async function fetchRequests() {
      const res = await getBorrowRequests();

      const requestsWithDetails = await Promise.all(
        res.data.map(async (req) => {
          const [bookRes, memberRes] = await Promise.all([
            getBookById(req.bookId),
            getMemberById(req.memberId)
          ]);

          return {
            ...req,
            memberName: memberRes.data.name,
            bookTitle: bookRes.data.title
          };
        })
      );
      console.table(requestsWithDetails)
      setRequests(requestsWithDetails.filter((req) => {
        return req.status === "Pending"
      })||[]);
      
    const approved = requestsWithDetails.filter(req => req.status === "Approved");

      const transactions = approved.map(req => ({
        memberId: req.memberId,
        bookId: req.bookId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // REQUIRED ✅
        status: "Issued" // ✅ MUST match schema enum
      }));

      await Promise.all(transactions.map(data => addTransaction(data)));
          }

    fetchRequests();
  }, []);
  const handleApprove = async (id) => {
    try {
      // disable button (optional but recommended)
      setLoadingIds((prev) => [...prev, id]);

      // optimistic UI update
      setRequests(prev =>
        prev.map(req =>
          req._id === id ? { ...req, status: "Approved" } : req
        )
      );

      // ✅ send only required data
      const res = await updateBorrowRequest(id, { status: "Approved" });

      console.log(res.data);
    } catch (error) {
      console.error(error);

      // ❗ rollback if needed
      setRequests(prev =>
        prev.map(req =>
          req._id === id ? { ...req, status: "Pending" } : req
        )
      );
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };
  const handleReject = async (id) => {
    try {
        setRequests(prev =>
          prev.map(req =>
            req._id === id ? { ...req, status: "Rejected" } : req
          )
        );
       // ✅ send only required data
      const res = await updateBorrowRequest(id, { status: "Approved" });
      console.log(res.data);
    } catch (error) {
      console.error(error);
      // ❗ rollback if needed
      setRequests(prev =>
        prev.map(req =>
          req._id === id ? { ...req, status: "Pending" } : req
        )
      );
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="p-6">

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Borrow Requests
      </h1>

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