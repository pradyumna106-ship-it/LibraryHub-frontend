import { useState } from "react";
import { addPublisher } from "../api/publisherApi";
import { useNavigate } from "react-router";

function AddPublisher() {
  const [formData, setFormData] = useState({
    name: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await addPublisher(formData);
      console.log(res);
      alert("Publisher added successfully ✅");
      navigate(-1); // 🔙 go back
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Error adding publisher");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 max-w-[500px] mx-auto bg-white shadow-md rounded-lg">
      
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-4">Add Publisher</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Publisher Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Address */}
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border px-3 py-2 rounded"
          rows={3}
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Adding..." : "Add Publisher"}
        </button>

      </form>
    </div>
  );
}

export default AddPublisher;