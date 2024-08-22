"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Protection from "../Protection";
import Layout from "../components/layout";
import LoadingScreen from "../components/LoadingScreen";
import { showErrorToast } from "../utils/toastUtils";
import { showSuccessToast } from "../utils/toastUtils";

import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [statusFilter, requests]);

  const loadRequests = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get("/api/inventory/requests/query");
      setRequests(response.data);
      setFilteredRequests(response.data); // Initially display all requests
    } catch (error) {
      showErrorToast("Error fetching requests");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const filterRequests = () => {
    if (statusFilter === "All") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((request) => request.status === statusFilter)
      );
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      await axios.delete(`/api/inventory/requests/${requestId}`);
      loadRequests(); // Reload requests after canceling
      showSuccessToast("Request canceled successfully");
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to cancel request");
    }
  };

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              My Requests
            </h1>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="denied">Denied</MenuItem>
              </Select>
            </FormControl>
            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.item
                          ? `${request.item.name} (${request.quantity})`
                          : "Item not found"}
                      </h3>
                      <p className="text-gray-600">
                        Type: {request.requestType}
                      </p>
                      <p
                        className={`text-${
                          request.status === "approved"
                            ? "green"
                            : request.status === "denied"
                            ? "red"
                            : "yellow"
                        }-600`}
                      >
                        Status:{" "}
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </p>
                      <p className="text-gray-500">
                        Requested on:{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {request.status === "pending" && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => cancelRequest(request._id)}
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No requests found.</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Protection>
  );
}
