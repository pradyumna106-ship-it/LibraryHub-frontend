import { useState,useEffect } from "react";
import { borrowedForOneMember,getDashboardStats } from "../api/transactionApi.js";

function Dashboard() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(0);
    useEffect(() => {
    async function loadDashboard() {
      try {
        // const user = JSON.parse(localStorage.getItem("user"));
        const memberId = 	'69c28ca4b067e752b9d87135';

        if (!memberId) {
          console.error("No memberId found");
          return;
        }

        // 🔥 Run both APIs in parallel
        const [borrowRes, statsRes] = await Promise.all([
          borrowedForOneMember(memberId),
          getDashboardStats(memberId)
        ]);

        console.log("Borrowed:", borrowRes);
        console.log("Stats:", statsRes);

        // ✅ Set data
        setBorrowedBooks(borrowRes.data.data);
        setDashboardStats(statsRes.data);

      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    }

    loadDashboard();
  }, []);
  return (
    <div className="p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8 max-w-[1000px]">
        {/* Borrowed Card */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600" />
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm mb-2">Borrowed Books</p>
            <p className="text-5xl font-bold">{dashboardStats.borrowed}</p>
          </div>
        </div>

        {/* Due Date Card */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm mb-2">Next Due Date</p>
            <p className="text-lg font-semibold">{dashboardStats.dueDate}</p>
          </div>
        </div>

        {/* Fine Card */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm mb-2">Outstanding Fines</p>
            <p className="text-5xl font-bold">{dashboardStats.fine}</p>
          </div>
        </div>
      </div>

      {/* Current Borrowed Books Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-[1000px]">
        <div className="px-6 py-4 bg-gradient-to-r from-[#93A5CF] to-[#B4ECE9]">
          <h2 className="text-xl font-semibold text-white">Current Borrowed Books</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {borrowedBooks.map((book, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{book.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      book.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
