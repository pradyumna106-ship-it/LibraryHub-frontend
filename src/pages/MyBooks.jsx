import BookCard from "../components/BookCard.jsx";
import { myBooks } from "../data/mockData.js";

function MyBooks() {
  const handleBorrow = (book) => {
    alert(`Reading: ${book.title}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Saved Books</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myBooks.map(book => (
          <BookCard key={book.id} book={book} onBorrow={handleBorrow} />
        ))}
      </div>

      {myBooks.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">You haven't saved any books yet.</p>
          <p className="mt-2">Browse our collection to find books you like!</p>
        </div>
      )}
    </div>
  );
}

export default MyBooks;
