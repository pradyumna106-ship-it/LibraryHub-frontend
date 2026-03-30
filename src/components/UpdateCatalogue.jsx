function UpdateCatalogue() {
  const books = [
    {
      title: "JavaScript",
      author: "John",
      category: "Programming",
      price: 500,
      available: "Yes",
      image: "img.jpg",
      publisher: "TechBooks"
    }
  ];

  return (
    <div className="p-6">

      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Update Catalogue
        </h1>

        <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm">
          Add Book
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">

          {/* Header */}
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Available</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Publish By</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="text-sm text-gray-700">
            {books.map((book, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="px-4 py-3">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">{book.category}</td>
                <td className="px-4 py-3">₹{book.price}</td>
                <td className="px-4 py-3">{book.available}</td>
                <td className="px-4 py-3">{book.image}</td>
                <td className="px-4 py-3">{book.publisher}</td>

                {/* Actions */}
                <td className="px-4 py-3 flex gap-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default UpdateCatalogue;