// app/batches/page.js

"use client"; // Because you are using state and effects

import React, { useState, useEffect } from "react";
import BatchList from "../../components/batch_components/BatchList";
import BatchForm from "../../components/batch_components/BatchForm";
import {
  fetchBatches,
  createBatch,
  deleteBatch,
} from "../../services/batchServices";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";

export default function BatchManager() {
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState("");

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const fetchedBatches = await fetchBatches();
      setBatches(fetchedBatches);
    } catch (error) {
      showErrorToast("Error fetching batches");
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      console.log(newBatchName);
      await createBatch(newBatchName);
      setNewBatchName(""); // Reset the new batch name input
      loadBatches();
      showSuccessToast("Batch added successfully");
    } catch (error) {
      showErrorToast("Error creating batch");
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      await deleteBatch(batchId);
      loadBatches();
      showSuccessToast("Batch deleted successfully");
    } catch (error) {
      showErrorToast("Error deleting batch");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Batch Manager</h1>
        <BatchForm
          newBatchName={newBatchName}
          setNewBatchName={setNewBatchName}
          onSubmit={handleCreateBatch}
        />
        <BatchList
          batches={batches} // Ensure you're passing the correct prop
          onDelete={handleDeleteBatch}
        />
      </div>
    </div>
  );
}
