import { useState,  useMemo, useEffect } from 'react';
import { Search, Calendar, Filter, ChevronDown, MoreVertical, Download } from 'lucide-react';
import { getTransactionsHistory } from '../api/transactionApi';
let cache = null;
const HistoryContent = () => {
  const [historyData,setHistoryData] = useState([
      { id: 1, memberName: 'John Doe', stock: 'React Crash Course', issueDate: '2026-03-15', returnDate: '2026-04-12', status: 'Issued' },
      { id: 2, memberName: 'Jane Smith', stock: 'Node.js Guide', issueDate: '2026-03-20', returnDate: '2026-04-17', status: 'Issued' },
      { id: 3, memberName: 'Bob Wilson', stock: 'MongoDB Basics', issueDate: '2026-03-25', returnDate: '2026-04-22', status: 'Returned' },
      { id: 4, memberName: 'Alice Brown', stock: 'Tailwind CSS', issueDate: '2026-03-28', returnDate: '2026-04-25', status: 'Overdue' },
      { id: 5, memberName: 'Mike Davis', stock: 'Next.js Cookbook', issueDate: '2026-03-30', returnDate: null, status: 'Issued' },
    ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
      useEffect(() => {
        async function fetchAll() {
          if (cache) {
            setHistoryData(cache)
            console.log('free cache')
            return
          }
          const res = await getTransactionsHistory();
          console.log(res)
          setHistoryData(res.data||[]);
          cache = [...historyData]
        }
        fetchAll()
      },[]);
  // Mock data - replace with your API call

  const filteredData = useMemo(() => {
        let filtered = historyData;

        // Search
        if (searchTerm) {
            filtered = filtered.filter(item =>
            item.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.book.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status
        if (filterStatus !== 'All') {
            filtered = filtered.filter(item => item.status === filterStatus);
        }

        // Date
        if (dateFilter) {
            filtered = filtered.filter(item =>
            new Date(item.issueDate) >= new Date(dateFilter)
            );
        }

        return filtered;
        }, [searchTerm, filterStatus, dateFilter, historyData]);

  const statusColors = {
    Issued: 'bg-blue-100 text-blue-800 border-blue-200',
    Returned: 'bg-green-100 text-green-800 border-green-200',
    Overdue: 'bg-red-100 text-red-800 border-red-200'
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExport = () => {
    const headers = ["Member Name", "Book", "Issue Date", "Return Date", "Status"];

    const rows = filteredData.map((item) => [
      item.memberName || "",
      item.stock || item.book || "",
      item.issueDate ? formatDate(item.issueDate) : "-",
      item.returnDate ? formatDate(item.returnDate) : "-",
      item.status || "",
    ]);

    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `admin-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-8">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-md">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members or books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm appearance-none"
            >
              <option>All</option>
              <option>Issued</option>
              <option>Returned</option>
              <option>Overdue</option>
            </select>
            <ChevronDown className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Calendar className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-48 px-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium flex items-center gap-2 shadow-lg">
            <Filter className="h-4 w-4" />
            Filters
          </button>

          <button
            onClick={handleExport}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all font-medium flex items-center gap-2 shadow-lg"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Member Name
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item,index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.memberName}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={item.stock}>
                      {item.stock}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(item.issueDate)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                    {item.returnDate ? formatDate(item.returnDate) : '-'}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer mx-1" />
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No history records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state or pagination would go here */}
      {filteredData.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-700">
          <div>Showing {filteredData.length} of {historyData.length} records</div>
          <div className="space-x-2">
            <button className="px-3 py-2 hover:bg-gray-100 rounded-lg">Previous</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 hover:bg-gray-100 rounded-lg">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryContent;