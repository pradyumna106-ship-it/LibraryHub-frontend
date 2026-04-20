import { useState, useEffect } from "react";
import { ChevronDown,SlidersHorizontal,X } from "lucide-react";
import BookCard from "./BookCard.jsx";
import { addMyBooks, deleteMyBooks, getMyBooks } from "../api/memberApi.js";
import { getBooks } from "../api/bookApi.js";
import { addBorrowRequest, getBorrowRequestBymemberId } from '../api/borrowRequestAPI.js';
import { useOutletContext } from "react-router-dom";

// ✅ Cache outside component
let cache = null;  // simple cache, not keyed by id

function ViewAllBooks() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const { searchQuery } = useOutletContext();
  const [showFilters, setShowFilters] = useState(false);
  // ✅ Single source of truth for id
  const id = localStorage.getItem('id');
  const categories = ["All", ...new Set((Array.isArray(allBooks) ? allBooks : []).map(book => book.category))];
  const authors = ["All", ...new Set((Array.isArray(allBooks) ? allBooks : []).map(book => book.author))];
  const q = (searchQuery || "").trim().toLowerCase();
  const safeSetAllBooks = (data) => {
    setAllBooks(Array.isArray(data) ? data : data?.data ?? data?.books ?? []);
  };
  const filteredBooks = (Array.isArray(allBooks) ? allBooks : []).filter(book => {
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
    const activeFilterCount = [
      selectedCategory !== "All",
      selectedAuthor !== "All",
      showAvailableOnly,
    ].filter(Boolean).length;
    useEffect(() => {
      async function fetchData() {
        try {
          const [myBooksRes, borrowRequestRes] = await Promise.all([
            getMyBooks(id),
            getBorrowRequestBymemberId(id)
          ]);
          if (myBooksRes.status === 200) setMyBooks(myBooksRes.data || []);
          if (borrowRequestRes.status === 200) setBorrowRequests(borrowRequestRes.data || []);
          if (cache) {
            setAllBooks(cache);  // ✅ cache holds the array directly
            return;
          }
          // ✅ Make sure it's always .data (the array), never the raw response
            const booksRes = await getBooks();
            if (booksRes.status === 200) {
              cache = booksRes.data || [];
              safeSetAllBooks(cache);
            }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchData();
    }, []);  // ✅ id never changes so [] is accurate

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
  const SelectField = ({ value, onChange, options }) => (
    <div className="relative flex-1 min-w-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-[#D4ECEC] border border-[#9CB7D6] rounded px-3 py-2 pr-8 text-sm cursor-pointer hover:bg-[#c4dce0] transition-colors"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CB7D6] pointer-events-none" />
    </div>
  );
  // ... rest of JSX unchanged
  return (
     <div className="p-3 md:p-8">
 
      {/* ── DESKTOP FILTERS ── */}
      <div className="hidden md:block mb-8">
        <div className="flex items-center gap-4 mb-6">
          <p className="font-['Inter'] font-normal text-[24px] text-black shrink-0">Filter:</p>
 
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
 
      {/* ── MOBILE FILTER BAR ── */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-base font-semibold text-gray-700">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 bg-[#D4ECEC] border border-[#9CB7D6] rounded-full px-4 py-1.5 text-sm font-medium"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#93A5CF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
 
        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <span className="flex items-center gap-1 bg-[#B4ECE9] text-gray-700 text-xs rounded-full px-3 py-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")}><X size={10} /></button>
              </span>
            )}
            {selectedAuthor !== "All" && (
              <span className="flex items-center gap-1 bg-[#B4ECE9] text-gray-700 text-xs rounded-full px-3 py-1">
                {selectedAuthor}
                <button onClick={() => setSelectedAuthor("All")}><X size={10} /></button>
              </span>
            )}
            {showAvailableOnly && (
              <span className="flex items-center gap-1 bg-[#B4ECE9] text-gray-700 text-xs rounded-full px-3 py-1">
                Available only
                <button onClick={() => setShowAvailableOnly(false)}><X size={10} /></button>
              </span>
            )}
          </div>
        )}
      </div>
 
      {/* ── MOBILE FILTER BOTTOM SHEET ── */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 shadow-2xl md:hidden">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={22} className="text-gray-500" />
              </button>
            </div>
 
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Category</label>
                <SelectField value={selectedCategory} onChange={setSelectedCategory} options={categories} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Author</label>
                <SelectField value={selectedAuthor} onChange={setSelectedAuthor} options={authors} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-[#93A5CF]"
                />
                <span className="text-sm font-medium text-gray-700">Show available only</span>
              </label>
            </div>
 
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedAuthor("All");
                  setShowAvailableOnly(false);
                }}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2.5 bg-[#93A5CF] text-white rounded-xl text-sm font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
 
      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
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
          <p className="text-lg md:text-xl">No books found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

export default ViewAllBooks;
