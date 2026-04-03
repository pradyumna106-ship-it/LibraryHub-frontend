import { useState,useEffect } from "react";
import { ChevronDown } from "lucide-react";
import BookCard from "./BookCard.jsx";
import { addMyBooks, deleteMyBooks, getMyBooks } from "../api/memberApi.js";
import { getBooks } from "../api/bookApi.js";
import {addBorrowRequest, getBorrowRequestBymemberId} from '../api/borrowRequestAPI.js'
import { useOutletContext } from "react-router-dom";

function ViewAllBooks() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [allBooks,setAllBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const { searchQuery } = useOutletContext();

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
          ? book.publisherId.name
          : book.publisherId;

      const titleMatch = (book.title || "").toLowerCase().includes(q);
      const authorMatch = (book.author || "").toLowerCase().includes(q);
      const publisherMatch = (publisherName || "").toString().toLowerCase().includes(q);

      if (!titleMatch && !authorMatch && !publisherMatch) return false;
    }
    return true;
  });
    const id = localStorage.getItem('id')||"69c28ca4b067e752b9d87135"
    useEffect(() => {
      async function fetchData() {
        try {
          const [booksRes, myBooksRes,borrowRequestRes] = await Promise.all([
            getBooks(),
            getMyBooks(id),
            getBorrowRequestBymemberId(id)
          ]);
          // ✅ Handle Books
          if (booksRes.status === 200) {
            console.log(booksRes);
            console.table(booksRes.data);
            setAllBooks(booksRes.data || []);
          } else {
            console.error(booksRes.data?.message);
          }
          // ✅ Handle My Books
          if (myBooksRes.status === 200) {
            setMyBooks(myBooksRes.data || []);
          } else {
            console.error(myBooksRes.data?.message);
          }
          if (borrowRequestRes.status === 200) {
            setBorrowRequests(borrowRequestRes.data || [])
          } else {
            console.error(borrowRequestRes.data?.message)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchData();
    }, [id]);
  const handleBookmark = async (book) => {
    try {
      const exists = myBooks.some((b) => b._id === book._id);
      let updatedBooks;
      
      if (exists) {
        // Remove from local state first (optimistic update)
        updatedBooks = myBooks.filter((b) => b._id !== book._id);
        setMyBooks(updatedBooks);
        
        // Call delete API when unchecking
        console.log("Removing bookId:", book._id);
        const res = await deleteMyBooks(id, book._id);  // ✅ New delete API call
        console.log("Delete response:", res.data);
      } else {
        // Add to local state first
        updatedBooks = [...myBooks, book];
        setMyBooks(updatedBooks);
        
        // Call add API
        console.log("Adding bookId:", book._id);
        const res = await addMyBooks(id, book._id);
        console.log("Add response:", res.data);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      // ✅ Rollback on error - reload from server or revert state
      // setMyBooks(previousBooks); // Use useRef for previous state
    }
  };
    const handleBorrow = async (book) => {
      alert(`Borrowing: ${book.title}`);
      const id = localStorage.getItem('id') || "69cdeb455ac4a12b21412d14"
      const res = await addBorrowRequest({memberId:id, bookId:book._id});
      console.log(res);
    };

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
