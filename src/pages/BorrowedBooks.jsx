//import { borrowedBooks } from "../data/mockData.js";

import { useEffect, useState } from "react";
import { borrowedForOneMember } from "../api/transactionApi.js";
function BorrowedBooks() {
  const memberId = 	'69c28ca4b067e752b9d87135'
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  useEffect(() => {
    async function loadBorrowedBooks() {
      const res = await borrowedForOneMember(memberId);
      console.log(res);
      setBorrowedBooks(res.data.data);
    }
    loadBorrowedBooks()
  });
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
              {borrowedBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-700">{book.author}</td>
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-700">{book.borrowDate}</td>
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-700">{book.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      book.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-700">
                    <span className={book.fine !== "$0" ? "text-red-600 font-semibold" : ""}>
                      {book.fine}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                        Renew
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
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
