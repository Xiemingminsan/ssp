import React from "react";

const BatchForm = ({ newBatchName, setNewBatchName, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mb-6 flex space-x-4">
      <input
        type="text"
        value={newBatchName}
        onChange={(e) => setNewBatchName(e.target.value)}
        placeholder="New course name"
        className="flex-grow p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Batch
      </button>
    </form>
  );
};

export default BatchForm;
