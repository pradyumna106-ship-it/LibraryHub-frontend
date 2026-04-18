import { useEffect, useState } from "react";
import { Edit3, Trash2, Eye, BookOpen } from 'lucide-react';
import { deleteBook, getBooks } from "../api/bookApi";
import { getPublishers } from "../api/publisherApi";
import { useNavigate, useOutletContext } from "react-router";

// ✅ Cache outside component
let cache = null;

function UpdateCatalogue() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext();

  const q = (searchQuery || "").trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    if (!q) return true;
    const publisherName =
      typeof book.publisherId === "object" && book.publisherId !== null
        ? book.publisherId.name : book.publisherId;
    return (
      (book.title || "").toLowerCase().includes(q) ||
      (book.author || "").toLowerCase().includes(q) ||
      (publisherName || "").toString().toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    // ✅ Use cache if available
    if (cache) {
      setBooks(cache);
      setLoading(false);
      return;
    }

    async function fetchBooksData() {
      try {
        setLoading(true);
        setError(null);
        const [bookRes, publisherRes] = await Promise.all([
          getBooks(),
          getPublishers()
        ]);
        const books = bookRes.data || [];
        const publishers = publisherRes.data || [];
        const formattedBooks = books.map((book) => {
          const publisherId =
            typeof book.publisherId === "object" && book.publisherId !== null
              ? book.publisherId._id : book.publisherId;
          const publisher = publishers.find((pub) => pub._id === publisherId);
          return {
            ...book,
            publisherId,
            publisher: book.publisherId?.name || (publisher ? publisher.name : "Unknown")
          };
        });
        cache = formattedBooks; // ✅ Cache the fetched data
        setBooks(formattedBooks);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    }
    fetchBooksData();
  }, []);

  const handleDelete = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    const previous = books; // ✅ Save for rollback
    try {
      setBooks(prev => prev.filter(book => book._id !== bookId));
      await deleteBook(bookId);
      cache = books.filter(book => book._id !== bookId); // ✅ Keep cache in sync
      alert('Book deleted successfully!');
    } catch (error) {
      setBooks(previous); // ✅ Rollback on failure
      alert('Failed to delete book');
    }
  };

  const handleEdit = (bookId, book) => {
    navigate(`/edit-book/${bookId}`, { state: book });
  };

  // ... rest of JSX unchanged
  if (loading) {
    return (
      <div className="p-6">
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
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 max-w-2xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-auto px-4 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Update Catalogue
        </h1>
        <button onClick={() => navigate('/add-book')} className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
          + Add Book
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-linear-to-r from-gray-800 to-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Available</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Publisher</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-40" />
                    No books found in catalogue
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book, index) => (
                  <tr key={book._id || index} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-gray-900 group-hover:text-blue-600">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-lg font-bold text-green-700">
                      ₹{book.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        book.available === 'Yes' 
                          ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                          : 'bg-red-100 text-red-800 border-2 border-red-200'
                      }`}>
                        {book.available}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {book.image ? (
                          <img 
                            src={book.image} 
                            alt={book.title}
                            className="h-10 w-10 rounded-lg object-cover border"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                            No img
                          </div>
                        )}
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{book.publisher}</td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(book._id, book)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg hover:scale-105 transition-all group/edit"
                          title="Edit Book"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(book._id || index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg hover:scale-105 transition-all group/delete"
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UpdateCatalogue;