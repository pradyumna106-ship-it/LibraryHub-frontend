//import { borrowedBooks } from "../data/mockData.js";

import { useEffect, useState } from "react";
import { borrowedForOneMember, renewBook, returnBook } from "../api/transactionApi.js";

let cache = {};
function BorrowedBooks() {
  const memberId = 	localStorage.getItem('id')
  const [borrowedBooks, setBorrowedBooks] = useState([]);
   useEffect(() => {
    async function loadBorrowedBooks() {
      if (!memberId) return;
      // ✅ cache check
      if (cache[memberId]) {
        setBorrowedBooks(cache[memberId]);
        console.log('from cache');
        return;
      }
      try {
        const res = await borrowedForOneMember(memberId);
        setBorrowedBooks(res.data);
        cache[memberId] = res.data; // ✅ correct
      } catch (err) {
        console.error(err);
      }
    }
    loadBorrowedBooks();
  }, [memberId]); // ✅ fixed

  
  const handleRenew = async (transactionId) => {
    try {
      const res = await renewBook(transactionId);
      console.log(res);
      // ✅ Update UI instantly
      setBorrowedBooks(prev =>
        prev.map(book =>
          book._id === transactionId
            ? {
                ...book,
                dueDate: res.data.dueDate, // updated date from backend
              }
            : book
        )
      );
      alert("Book renewed successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to renew book");
    }
  };
  const handleReturn = async (transactionId) => {
    try {
      const res = await returnBook(transactionId);
      console.log(res);

      // ✅ Update UI instantly
      setBorrowedBooks(prev =>
        prev.map(book =>
          book._id === transactionId
            ? {
                ...book,
                status: "Returned",
                returnDate: new Date().toISOString(),
              }
            : book
        )
      );

      alert("Book returned successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to return book");
    }
  };
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Borrowed Books</h1>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Title</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Author</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Borrow Date</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Due Date</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Status</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Fine</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {borrowedBooks.map((book, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  
                  <td className="px-6 py-4">{book.title}</td>
                  
                  <td className="px-6 py-4">{book.author}</td>
                  
                  {/* Format Date */}
                  <td className="px-6 py-4">
                    {new Date(book.issueDate).toLocaleDateString()}
                  </td>

                  {/* Return Date */}
                  <td className="px-6 py-4">
                    {book.dueDate 
                      ? new Date(book.dueDate).toLocaleDateString() 
                      : "Not Returned"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.status === "Issued"
                        ? "bg-yellow-100 text-yellow-800"
                        : book.status === "Returned"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {book.status}
                    </span>
                  </td>

                  {/* Fine (optional fallback) */}
                  <td className="px-6 py-4">
                    {book.fineAmount ? book.fineAmount : "₹0"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        disabled={book.status !== "Issued"}
                        onClick={() => handleRenew(book._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-400"
                      >
                        Renew
                      </button>
                      <button
                        disabled={book.status !== "Issued"}
                        onClick={() => handleReturn(book._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-400"
                      >
                        Return
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {borrowedBooks.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">You don't have any borrowed books.</p>
          <p className="mt-2">Visit the "View All Books" page to borrow books!</p>
        </div>
      )}
    </div>
  );
}

export default BorrowedBooks;
