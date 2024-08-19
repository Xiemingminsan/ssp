import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batchName, setBatchName] = useState("");

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await axios.get(`/api/batches/${id}`);
        console.log("Batch:", response.data);
        setBatchName(response.data.name);
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    };

    fetchBatch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/batches/${id}`, {
        name: batchName,
      });
      console.log("Batch updated:", response.data);
      navigate("/batches");
    } catch (error) {
      console.error("Error updating batch:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/batches/${id}`);
      navigate("/batches");
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Batch</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Update Batch
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBatch;
