import { useState, useEffect } from "react";
import { getPublishers } from "../api/publisherApi";
import { updateBook } from "../api/bookApi";
import { useLocation, useNavigate, useParams } from "react-router";

function EditBook() {
  const location = useLocation();
  const [formData, setFormData] = useState(location.state);
  const {id} = useParams()
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  // ✅ Fetch publishers
  useEffect(() => {
    async function fetchPublishers() {
      try {
        const res = await getPublishers();
        if (res.status === 200) {
          setPublishers(res.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchPublishers();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value
    }));
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

          const res = await updateBook(id,formData);
          console.log(res)

      alert("Book added successfully ✅");

      // Reset form
      setFormData({
        title: "",
        author: "",
        category: "",
        price: "",
        ISBN: "",
        image: "",
        publisherId: ""
      });
    
    } catch (error) {
        console.error(error);

        if (error?.response?.data?.message?.includes("duplicate")) {
            alert("ISBN already exists ❌");
        } else {
            alert(error?.response?.data?.message || "Error adding book");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[600px] mx-auto bg-white shadow-md rounded-lg">
        <button onClick={() => {navigate('/crud-book')}} className="mb-4 text-blue-600 underline">⬅ Back</button>
      <h2 className="text-2xl font-semibold mb-4">Add Book</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="ISBN"
          value={formData.ISBN}
          onChange={handleChange}
          placeholder="ISBN"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border px-3 py-2 rounded"
        />

        {/* ✅ Publisher Dropdown */}
       <div className="flex gap-2">
            <select
                name="publisherId"
                value={formData.publisherId}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
            >
                <option value="">Select Publisher</option>
                {publishers.map((pub) => (
                <option key={pub._id} value={pub._id}>
                    {pub.name}
                </option>
                ))}
            </select>

            {/* ➕ Add Publisher Button */}
            <button
                type="button"
                onClick={() => navigate("/add-publisher")}
                className="bg-green-600 text-white px-3 rounded hover:bg-green-700"
            >
                +
            </button>
            </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>

      </form>
    </div>
  );
}

export default EditBook;