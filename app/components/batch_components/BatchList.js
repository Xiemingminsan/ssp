import React from "react";
import { useNavigate } from "react-router-dom";

const BatchList = ({ batch = [], onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (batchId) => {
    navigate(`/EditBatch/${batchId}`);
  };

  return (
    <ul className="space-y-4">
      {batch.map((batch) => (
        <li
          key={batch._id}
          className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow"
        >
          <span className="font-medium">{batch.name}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(batch._id)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(batch._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BatchList;
