"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Protection from "../Protection";
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import {
  Button,
  Modal,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import Link from "next/link";
import LoadingScreen from "../components/LoadingScreen";
import { set } from "mongoose";

export default function NewRequest() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestType, setRequestType] = useState(""); // Empty until the user selects
  const [dueDate, setDueDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get("/api/inventory");
      setItems(response.data);
    } catch (error) {
      showErrorToast("Error fetching items");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setQuantity("");
    setRequestType(""); // Reset the request type when closing the modal
  };

  const handleSubmitRequest = async () => {
    if (!selectedItem || !quantity || !requestType) {
      showErrorToast(
        "Please select an item, request type, and specify the quantity."
      );
      return;
    }

    try {
      await axios.post("/api/inventory/requests", {
        itemId: selectedItem._id,
        quantity,
        requestType,
        dueDate,
      });

      showSuccessToast("Request submitted successfully");
      handleCloseModal();
    } catch (error) {
      showErrorToast("Failed to submit request");
    }
  };

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Request Items
              </h1>
              <Link href="/viewrequest">
                <Button variant="contained" color="secondary">
                  View My Requests
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">
                        Available: {item.availableQuantity}
                      </p>
                      <p className="text-gray-500">{item.description}</p>
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(item)}
                    >
                      Submit Request
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No items available.</p>
              )}
            </div>
          </div>
        </div>

        <Modal open={isModalOpen} onClose={handleCloseModal}>
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
              minWidth: 300,
            }}
          >
            <h2>Submit Request</h2>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="request-type-label">Request Type</InputLabel>
              <Select
                labelId="request-type-label"
                value={requestType}
                label="Request Type"
                onChange={(e) => setRequestType(e.target.value)}
              >
                <MenuItem value="takeOut">Take Out</MenuItem>
                <MenuItem value="return">Return</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextField
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleSubmitRequest}
            >
              Submit {requestType === "takeOut" ? "Take Out" : "Return"} Request
            </Button>
          </Box>
        </Modal>
      </Layout>
    </Protection>
  );
}
