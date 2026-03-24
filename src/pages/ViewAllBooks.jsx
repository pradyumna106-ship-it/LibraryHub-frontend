import { useState } from "react";
import { ChevronDown } from "lucide-react";
import BookCard from "../components/BookCard.jsx";
import { books as allBooks } from "../data/mockData.js";

function ViewAllBooks() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const categories = ["All", ...new Set(allBooks.map(book => book.category))];
  const authors = ["All", ...new Set(allBooks.map(book => book.author))];

  const filteredBooks = allBooks.filter(book => {
    if (selectedCategory !== "All" && book.category !== selectedCategory) return false;
    if (selectedAuthor !== "All" && book.author !== selectedAuthor) return false;
    if (showAvailableOnly && !book.available) return false;
    return true;
  });

  const handleBorrow = (book) => {
    alert(`Borrowing: ${book.title}`);
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
          <BookCard key={book.id} book={book} onBorrow={handleBorrow} />
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
