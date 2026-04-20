import { useEffect, useState } from "react";
import { deleteMember, getMembers } from '../api/memberApi';
import { useNavigate } from 'react-router';
import { Users } from "lucide-react";
let cache = null
function ManageUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // ✅ Fixed: Import your API function
    // import { fetchBooks, deleteBook, updateBook } from '../api/bookApi';
    const handleDelete = async (id) => {
      const previous = users;
      try {
        setUsers(prev => prev.filter(u => u._id !== id));
        const res = await deleteMember(id);
        cache = users.filter(u => u._id !== id); // keep cache in sync
        console.log(res.data.message);
      } catch (err) {
        console.error(err);
        setUsers(previous);
        alert('Failed to delete user');
      }
    };
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
      }, [users]);
      
    const statusStyle = (status) => {
      if (status === "Active") return "bg-green-100 text-green-800";
      if (status === "Blocked") return "bg-red-100 text-red-800";
      return "bg-gray-200 text-gray-700";
    };

        if (loading) {
          return (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-6 mb-8 max-w-[1000px]">
                {[...Array(5)].map((_, i) => (
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
    <div className="p-3 md:p-6">
 
      {/* Top Section */}
      <div className="flex justify-between items-center mb-5 md:mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600 shrink-0" />
          Manage Users
        </h1>
        <button
          onClick={() => navigate('/add-member')}
          className="shrink-0 bg-gray-300 hover:bg-gray-400 px-3 py-2 md:px-4 rounded-md text-sm font-medium transition-colors"
        >
          + Add User
        </button>
      </div>
 
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}
 
      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
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
          <tbody className="text-sm text-gray-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.dept}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.memberType}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      onClick={() => navigate(`/edit-member/${user._id}`, { state: user })}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
 
      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              {/* Top: name + status */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle(user.status)}`}>
                  {user.status}
                </span>
              </div>
 
              {/* Details */}
              <div className="space-y-0.5 text-xs text-gray-500 mb-3">
                <p className="truncate">{user.email}</p>
                <div className="flex gap-3">
                  <span>{user.phone}</span>
                  {user.dept && <span>· {user.dept}</span>}
                  {user.memberType && <span>· {user.memberType}</span>}
                </div>
              </div>
 
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                  onClick={() => navigate(`/edit-member/${user._id}`, { state: user })}
                >
                  Edit
                </button>
                <button
                  className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageUser;