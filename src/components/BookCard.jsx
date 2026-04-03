import { Bookmark } from 'lucide-react';

function BookCard({ book, onBorrow, onBookmark, myBooks=[],borrowRequests=[]}) {
  const isBookmarked = myBooks.some((b) => b._id === book._id);
  const request = Array.isArray(borrowRequests)
  ? borrowRequests.find(req => req.bookId === book._id)
  : null;
   const isPending = request?.status === "Pending";
   const isAccepted = request?.status === "Accepted";
   const isCompleted = request?.status === "Completed"
  return (
    <div className="bg-white border border-[#d9d9d9] rounded-lg shadow-md p-4 flex flex-col gap-4 w-[240px] hover:shadow-lg transition-shadow">
       {/* Bookmark Icon */}
      <div className="flex justify-end">
        {onBookmark && (
          <button onClick={() => onBookmark(book)}>
           {isBookmarked ? (
            <Bookmark className="fill-black text-black" size={20} strokeWidth={2} />
          ) : (
            <Bookmark className="stroke-black text-black" size={20} strokeWidth={2} />
          )}
          </button>
        )}
      </div>
      {/* Book Image */}
      <div className="h-[247px] relative w-full overflow-hidden rounded-md">
        <img 
          alt={book.title} 
          className="absolute h-[117.05%] left-[-19.5%] max-w-none top-[-8.53%] w-[139%]" 
          src={book.image} 
        />
      </div>

      {/* Book Details */}
      <div className="flex flex-col gap-2">
        <p className="font-['Inter'] font-normal text-[16px] text-[#1e1e1e] line-clamp-2">
          {book.title}
        </p>
        <p className="font-['Inter'] font-semibold text-[16px] text-[#1e1e1e]">
          {book.price}
        </p>
        <p className="font-['Inter'] font-normal text-[14px] text-[#757575] line-clamp-1">
          {book.author}
        </p>
        
        {/* Borrow Button */}
        <button
            onClick={() => onBorrow && onBorrow(book)}
            disabled={!book.available || isPending || isAccepted || isCompleted}
            className={`h-[29px] rounded-xl px-4 py-1 transition-colors ${
              isPending
                ? "bg-yellow-500 text-white cursor-not-allowed"
                : isAccepted
                ? "bg-green-600 text-white cursor-not-allowed"
                : isCompleted
                ? "bg-gray-500 text-white cursor-not-allowed"
                : book.available
                ? "bg-[#9d1010] hover:bg-[#7d0d0d] text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            <p className="font-['Inter'] font-normal text-[14px]">
              {isPending
                ? "Pending"
                : isAccepted
                ? "Issued"       // ✅ better wording
                : isCompleted
                ? "Returned"     // ✅ clear status
                : book.available
                ? "Borrow"
                : "Not Available"}
            </p>
          </button>

        {/*add myBooks*/}
        
      </div>
    </div>
  );
}

export default BookCard;
