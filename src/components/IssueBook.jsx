import { useState } from "react";

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

  const handleApprove = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
  };

  const handleReject = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "Rejected" } : req
      )
    );
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
            {requests.map((req) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">

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
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
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