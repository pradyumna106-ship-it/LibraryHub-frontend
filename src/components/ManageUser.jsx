import { useEffect, useState } from "react";
import { deleteMember, getMembers} from '../api/memberApi'
import { useNavigate } from 'react-router'
let cache = null
function ManageUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // ✅ Fixed: Import your API function
    // import { fetchBooks, deleteBook, updateBook } from '../api/bookApi';
    const handleDelete = async (id) => {
        const res = await deleteMember(id);
        console.log(res.data.message)
      }
      useEffect(() => {
        async function fetchBooksData() {
          try {
            setLoading(true);
            setError(null);
            if(cache) {
              setUsers(cache)
              return;
            }
            // ✅ Fixed: Proper fetch + response.json()
            const res = await getMembers();  // axios
            const data = res.data;
            setUsers(Array.isArray(data) ? data : data.members || []);
            cache = users
          } catch (err) {
            console.error(err);
            alert('Failed to delete book');
          } finally {
            setLoading(false);
          }
        }
        fetchBooksData();
      }, []);
  return (
    <div className="p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Manage Users
        </h1>
        <button onClick={() => navigate(`/add-member`)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm">
          Add User
        </button>
      </div>
      {loading && <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md" />
        </div>
        <div className="bg-white shadow-md rounded-lg border border-gray-200">
          <div className="h-16 bg-linear-to-r from-gray-800 to-gray-700 animate-pulse" />
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>}
      {error && <p className="text-red-500">{error}</p>}
      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Dept</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          {/* Body */}
          <tbody className="text-sm text-gray-700">
            {users.map((user, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.dept}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone}</td>
                <td className="px-4 py-3">{user.memberType}</td>
                {/* Status Badge */}
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : user.status === "Blocked"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {user.status}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-4 py-3 flex gap-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600" onClick={() => navigate(`/edit-member/${user._id}`,{state:user})}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600" onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ManageUser;