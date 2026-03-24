function BookCard({ book, onBorrow }) {
  return (
    <div className="bg-white border border-[#d9d9d9] rounded-lg shadow-md p-4 flex flex-col gap-4 w-[240px] hover:shadow-lg transition-shadow">
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
          disabled={!book.available}
          className={`h-[29px] rounded-xl px-4 py-1 transition-colors ${
            book.available
              ? "bg-[#9d1010] hover:bg-[#7d0d0d] text-white"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          <p className="font-['Inter'] font-normal text-[14px]">
            {book.available ? "Borrow" : "Not Available"}
          </p>
        </button>
      </div>
    </div>
  );
}

export default BookCard;
