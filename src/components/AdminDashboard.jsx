import { useEffect, useState } from 'react';
import { BookOpen, Users, Receipt, Loader2 } from 'lucide-react';
import { getBookCount } from '../api/bookApi';
import { getMemberCount } from '../api/memberApi';
import { getIssuedCount, getTransactionsWithNameTitle } from '../api/transactionApi';


export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [Issues,setIssues] = useState([
    { name: "Pradyumna", book: "JavaScript Basics", date: "10 Mar 2026", status: "Active" },
    { name: "Ram", book: "Python Guide", date: "12 Mar 2026", status: "Overdue" }
  ]);

  useEffect(() => {
    const fetchCounts = async () => {
        try {
          const [booksRes, membersRes, issuedRes, TransactionRes] = await Promise.all([
            getBookCount(),
            getMemberCount(),
            getIssuedCount(),
            getTransactionsWithNameTitle()
          ]);
          // ✅ Extract .data from each response
          setDashboardStats({
            totalBooks: booksRes.data || 0,      // 123
            totalMembers: membersRes.data || 0, // 456  
            issuedBooks: issuedRes.data || 0     // 78
          });
          const formated = TransactionRes.data.map((issue) => ({
              ...issue,
              name: issue.memberName,
              book: issue.bookTitle,
              date: issue.issueDate
          }));
          setIssues(formated)
        } catch (error) {
          console.error(error);
          setError(error)
        } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-6 mb-8 max-w-[1000px]">
          {[...Array(3)].map((_, i) => (
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

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl max-w-[1000px]">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 ml-4"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-[1000px]">
        {/* Total Books */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600" />
          <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
            <div>
              <p className="text-sm mb-2 opacity-90">Total Books</p>
              <p className="text-4xl md:text-5xl font-bold leading-tight">
                {dashboardStats.totalBooks.toLocaleString()}
              </p>
            </div>
            <BookOpen className="h-12 w-12 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Total Members */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
          <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
            <div>
              <p className="text-sm mb-2 opacity-90">Total Members</p>
              <p className="text-4xl md:text-5xl font-bold leading-tight">
                {dashboardStats.totalMembers.toLocaleString()}
              </p>
            </div>
            <Users className="h-12 w-12 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Issued Books */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
          <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
            <div>
              <p className="text-sm mb-2 opacity-90">Issued Books</p>
              <p className="text-4xl md:text-5xl font-bold leading-tight">
                {dashboardStats.issuedBooks.toLocaleString()}
              </p>
            </div>
            <Receipt className="h-12 w-12 opacity-80 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Current Borrowed Books Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-[1000px]">
        <div className="px-8 py-6 bg-gradient-to-r from-[#93A5CF] to-[#B4ECE9]">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Receipt className="h-7 w-7 mr-3" />
            Current Borrowed Books
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Member Name</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Book</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Issues.map((issue, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                    {issue.name}
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-gray-700 max-w-md truncate" title={issue.book}>
                      {issue.book}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-600">
                    {issue.date}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
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