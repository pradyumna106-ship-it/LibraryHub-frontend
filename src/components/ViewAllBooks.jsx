import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import BookCard from "./BookCard.jsx";
import { addMyBooks, deleteMyBooks, getMyBooks } from "../api/memberApi.js";
import { getBooks } from "../api/bookApi.js";
import { addBorrowRequest, getBorrowRequestBymemberId } from '../api/borrowRequestAPI.js';
import { useOutletContext } from "react-router-dom";

// ✅ Cache outside component
let cache = null;

function ViewAllBooks() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const { searchQuery } = useOutletContext();

  // ✅ Single source of truth for id
  const id = localStorage.getItem('id') || "69c28ca4b067e752b9d87135";

  const categories = ["All", ...new Set(allBooks.map(book => book.category))];
  const authors = ["All", ...new Set(allBooks.map(book => book.author))];

  const q = (searchQuery || "").trim().toLowerCase();
  const filteredBooks = allBooks.filter(book => {
    if (selectedCategory !== "All" && book.category !== selectedCategory) return false;
    if (selectedAuthor !== "All" && book.author !== selectedAuthor) return false;
    if (showAvailableOnly && !book.available) return false;
    if (q) {
      const publisherName =
        typeof book.publisherId === "object" && book.publisherId !== null
          ? book.publisherId.name : book.publisherId;
      if (
        !(book.title || "").toLowerCase().includes(q) &&
        !(book.author || "").toLowerCase().includes(q) &&
        !(publisherName || "").toString().toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  useEffect(() => {
    // ✅ Use cache for books if available; still fetch myBooks/borrowRequests (user-specific)
    async function fetchData() {
      try {
        const [myBooksRes, borrowRequestRes] = await Promise.all([
          getMyBooks(id),
          getBorrowRequestBymemberId(id)
        ]);
        if (myBooksRes.status === 200) setMyBooks(myBooksRes.data || []);
        if (borrowRequestRes.status === 200) setBorrowRequests(borrowRequestRes.data || []);

        if (cache) {
          setAllBooks(cache); // ✅ Use cached books
          return;
        }

        const booksRes = await getBooks();
        if (booksRes.status === 200) {
          cache = booksRes.data || []; // ✅ Cache books (they're shared, not user-specific)
          setAllBooks(cache);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []); // ✅ id never changes so [] is accurate

  const handleBookmark = async (book) => {
    const previous = myBooks; // ✅ Save for rollback
    try {
      const exists = myBooks.some((b) => b._id === book._id);
      if (exists) {
        setMyBooks(myBooks.filter((b) => b._id !== book._id));
        await deleteMyBooks(id, book._id);
      } else {
        setMyBooks([...myBooks, book]);
        await addMyBooks(id, book._id);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      setMyBooks(previous); // ✅ Rollback on failure
    }
  };

  const handleBorrow = async (book) => {
    alert(`Borrowing: ${book.title}`);
    // ✅ Use the same id, no re-declaration
    const res = await addBorrowRequest({ memberId: id, bookId: book._id });
    console.log(res);
  };

  // ... rest of JSX unchanged
  return (
    <div className="p-8">
      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <p className="font-['Inter'] font-normal text-[24px] text-black">Filter:</p>
          
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-[#D4ECEC] border border-[#9CB7D6] rounded px-4 py-2 pr-10 font-['Inter'] text-[18px] cursor-pointer hover:bg-[#c4dce0] transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CB7D6] pointer-events-none" />
          </div>

          {/* Author Dropdown */}
          <div className="relative">
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="appearance-none bg-[#D4ECEC] border border-[#9CB7D6] rounded px-4 py-2 pr-10 font-['Inter'] text-[18px] cursor-pointer hover:bg-[#c4dce0] transition-colors"
            >
              {authors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CB7D6] pointer-events-none" />
          </div>

          {/* Available Checkbox */}
          <label className="flex items-center gap-2 bg-[#D4ECEC] border border-[#9CB7D6] rounded px-4 py-2 cursor-pointer hover:bg-[#c4dce0] transition-colors">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="font-['Inter'] text-[18px]">Available</span>
          </label>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <BookCard
            key={book._id}
            book={book}
            onBorrow={handleBorrow}
            onBookmark={handleBookmark}
            myBooks={myBooks}
            borrowRequests={borrowRequests}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">No books found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

export default ViewAllBooks;
