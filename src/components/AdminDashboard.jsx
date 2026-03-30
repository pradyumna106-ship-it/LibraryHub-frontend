

export default function AdminDashboard() {
  const dashboardStats = {
    totalBooks: 120,
    totalMembers: 300,
    issuedBooks: 80
  };
  const Issues = [
    {
        name: "Pradyumna",
        book: "JavaScript Basics",
        date: "10 Mar 2026",
        status: "Active"
    },
    {
        name: "Ram",
        book: "Python Guide",
        date: "12 Mar 2026",
        status: "Overdue"
    }
    ];
  return (
    <div className="p-6 space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8 max-w-[1000px]">

        {/* Total Books */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600" />
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm mb-2">Total Books</p>
            <p className="text-5xl font-bold">{dashboardStats.totalBooks}</p>
          </div>
        </div>

        {/* Total Members */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm mb-2">Total Members</p>
            <p className="text-5xl font-bold">{dashboardStats.totalMembers}</p>
          </div>
        </div>

        {/* Issued Books */}
        <div className="relative h-[150px] rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
          <div className="relative z-10 p-6 text-white">
            <p className="text-sm mb-2">Issued Books</p>
            <p className="text-5xl font-bold">{dashboardStats.issuedBooks}</p>
          </div>
        </div>
      </div>

      {/* Tables (Coming from API later) */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-[1000px]">
        <div className="px-6 py-4 bg-gradient-to-r from-[#93A5CF] to-[#B4ECE9]">
          <h2 className="text-xl font-semibold text-white">Current Borrowed Books</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Member Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Book</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {Issues.map((issue, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">

                    {/* Member Name */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {issue.name}
                    </td>

                    {/* Book */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                        {issue.book}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                        {issue.date}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        issue.status === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
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