import { useEffect, useState } from "react";
import { getHistoryByMember } from "../api/transactionApi.js";
function History() {
  const [historyData, setHistoryData] = useState([]);
  const memberId = 	'69c28ca4b067e752b9d87135';
  useEffect(() => {
    async function loadHistory() {
      const res = await getHistoryByMember(memberId);
      console.log(res);
      setHistoryData(res.data)
    }
    loadHistory()
  },[]);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Borrowing History</h1>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Title</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Borrow</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Return</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Status</th>
                <th className="px-6 py-4 text-left font-['Inter'] font-semibold text-[16px] text-black">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historyData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-900">{record.title}</td>
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-700">{record.borrowDate}</td>
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-700">{record.returnDate}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-['Inter'] text-[15px] text-gray-700">
                    <span className={record.fine !== "$0" ? "text-red-600 font-semibold" : ""}>
                      {record.fine}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {historyData.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">No borrowing history found.</p>
        </div>
      )}
    </div>
  );
}

export default History;
