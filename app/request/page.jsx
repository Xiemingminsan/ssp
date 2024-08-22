"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Protection from "../Protection";
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { IconButton, Badge, Button, Modal, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoadingScreen from "../components/LoadingScreen";
import { set } from "mongoose";

export default function RequestManager() {
  const [requests, setRequests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true); // Start loading
      const fetchedRequests = await fetchRequests();
      setRequests(fetchedRequests);
      const pendingRequests = fetchedRequests.filter(
        (request) => request.status === "pending"
      );
      setPendingCount(pendingRequests.length);
    } catch (error) {
      showErrorToast("Error fetching requests");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/inventory/requests/pending");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch requests"
      );
    }
  };

  const handleApprove = async (requestId) => {
    try {
      // Send the request to approve the item
      await axios.put(`/api/inventory/requests/${requestId}`, {
        status: "approved",
      });
      loadRequests(); // Reload the requests to update the UI
      showSuccessToast("Request approved successfully");
    } catch (error) {
      showErrorToast("Failed to approve request");
    }
  };

  const handleDeny = async (requestId) => {
    try {
      // Send the request to deny the item
      await axios.put(`/api/inventory/requests/${requestId}`, {
        status: "denied",
      });
      loadRequests(); // Reload the requests to update the UI
      showSuccessToast("Request denied successfully");
    } catch (error) {
      showErrorToast("Failed to deny request");
    }
  };

  const handleViewLogs = (request) => {
    setSelectedRequest(request);
    setLogModalOpen(true);
  };

  const closeModal = () => {
    setLogModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Request Management
              </h1>
            </div>
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div
                    key={request._id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.item?.name || "Item name not available"}
                        {console.log(request.item)}
                      </h3>
                      <p className="text-gray-600">
                        Total Quantity: {request.item?.quantity}
                      </p>
                      <p className="text-gray-600">
                        Available: {request.item?.availableQuantity}
                      </p>

                      <p className="text-gray-500">
                        Requested by:{" "}
                        {request.user?.username || "User name not available"}
                      </p>
                      <p className="text-gray-500">
                        Requested amount:{" "}
                        {request.quantity || "Quantity not available"}
                      </p>
                      <p className="text-gray-500">
                        Request Status:{" "}
                        {request.requestType || "requestType not available"}
                      </p>
                      <p className="text-gray-500">
                        Request Date:{" "}
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(request._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeny(request._id)}
                      >
                        Deny
                      </Button>
                      <Button
                        variant="text"
                        color="info"
                        onClick={() => handleViewLogs(request)}
                      >
                        View Logs
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No requests available.
                </p>
              )}
            </div>
          </div>
        </div>
        <Modal open={logModalOpen} onClose={closeModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 24,
              p: 4,
              minWidth: 400,
            }}
          >
            <h2>Request Logs</h2>
            {selectedRequest?.logs.map((log, index) => (
              <div key={index} className="mt-2">
                <p>
                  <strong>{log.actionType}</strong>:{" "}
                  {new Date(log.modifiedAt).toLocaleString()}
                </p>
                <p>Modified By: {log.modifiedBy.name}</p>
                <p>Previous State: {JSON.stringify(log.previousState)}</p>
                <p>New State: {JSON.stringify(log.newState)}</p>
                {log.additionalInfo && <p>Info: {log.additionalInfo}</p>}
              </div>
            ))}
          </Box>
        </Modal>
      </Layout>
    </Protection>
  );
}
