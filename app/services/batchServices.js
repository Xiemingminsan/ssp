import axios from "axios";

export const fetchBatches = async () => {
  const response = await axios.get("/api/batches");
  return response.data;
};

export const createBatch = async (batchName) => {
  const response = await axios.post("/api/batches", { batchName });
  return response.data;
};

export const deleteBatch = async (batchId) => {
  await axios.delete(`/api/batches/${batchId}`);
};

export const updateBatch = async (batchId, batchName) => {
  await axios.put(`/api/batches/${batchId}`, { batchName });
};
