import { useEffect, useState } from "react";
import BookCard from "./BookCard.jsx";
import { getMyBooks } from "../api/memberApi.js"; 
import { getBookById } from "../api/bookAPI.js";
function MyBooks() {
    const id = "69c28ca4b067e752b9d87135"
    //const [bookIds,setBookIds] = useState([])
    const [myBooks, setMyBooks] = useState(() => {
    return JSON.parse(localStorage.getItem("myBooks")) || [];
  });
    useEffect(() => {
      const fetchBooks = async () => {
        try {
          // 1️⃣ Get Book IDs
          const res = await getMyBooks(id);

          if (res.status !== 200) {
            console.error(res.data.message);
            return;
          }

          const ids = res.data.map((b) => b._id);
          console.log("Book IDs:", ids);

          // ❗ Ensure it's an array
          if (!Array.isArray(ids)) {
            console.error("IDs is not an array");
            return;
          }

          // 2️⃣ Fetch all book details
          const bookPromises = ids.map((bookId) => getBookById(bookId));

          const bookResponses = await Promise.all(bookPromises);

          // 3️⃣ Extract data
          const books = bookResponses.map((res) => res.data);

          // 4️⃣ Update state
          setMyBooks(books);

          // 5️⃣ Store
          localStorage.setItem("myBooks", JSON.stringify(books));

        } catch (error) {
          console.error("Error fetching myBooks:", error);
        }
      };

      fetchBooks();
    }, []);
  const handleBorrow = (book) => {
    alert(`Reading: ${book.title}`);
  };
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Saved Books</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myBooks.map(book => (
          <BookCard
            key={book._id}   // ✅ use _id
            book={book}
            onBorrow={handleBorrow}
          />
        ))}
      </div>

      {Array.isArray(myBooks) && myBooks.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">You haven't saved any books yet.</p>
          <p className="mt-2">Browse our collection to find books you like!</p>
        </div>
      )}
    </div>
  );
}

export default MyBooks;
