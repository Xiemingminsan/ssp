"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemList from "../components/item_components/ItemList";
import ItemForm from "../components/item_components/ItemForm";
import LoadingScreen from "../components/LoadingScreen";
import Protection from "../Protection";
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Link from "next/link";
export default function ItemManager() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [pendingCount, setPendingCount] = useState(0); // State to manage pending requests count
  const [loading, setLoading] = useState(true); // Add this state

  useEffect(() => {
    loadItems();
    loadPendingRequestsCount(); // Load pending requests count on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true); // Start loading
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
      setFilteredItems(fetchedItems); // Initially display all items
    } catch (error) {
      showErrorToast("Error fetching items");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/inventory");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch items");
    }
  };

  const loadPendingRequestsCount = async () => {
    try {
      const pendingRequests = await fetchRequests();
      setPendingCount(pendingRequests.length); // Set pending requests count
    } catch (error) {
      showErrorToast("Error fetching pending requests");
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

  const createItem = async (itemName, itemQuantity, itemDescription) => {
    try {
      const itemResponse = await axios.post("/api/inventory", {
        name: itemName,
        quantity: itemQuantity,
        description: itemDescription,
      });

      const itemId = itemResponse.data._id;
      console.log("Item ID:", itemId);

      if (!itemId) {
        throw new Error("Item ID is undefined. Check API response.");
      }

      loadItems(); // Reload items after adding a new one
      showSuccessToast("Item added successfully");
    } catch (error) {
      console.error("Error creating item:", error);
      showErrorToast(error.response?.data?.message || "Failed to create item");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/inventory/${itemId}`);

      loadItems();
      showSuccessToast("Item deleted successfully");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to delete item");
    }
  };

  const handleCreateItem = async () => {
    try {
      await createItem(newItemName, newItemQuantity, newItemDescription);
      setNewItemName(""); // Reset the input after creation
      setNewItemQuantity(""); // Reset quantity after creation
      setNewItemDescription(""); // Reset description after creation
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const filterItems = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = items.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowercasedFilter) ||
        (item.description ?? "").toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredItems(filteredData);
  };
  const editItem = async (itemId, itemName, itemQuantity, itemDescription) => {
    try {
      await axios.put(`/api/inventory/${itemId}`, {
        name: itemName,
        quantity: itemQuantity,
        description: itemDescription,
      });
      loadItems(); // Reload items after editing
      showSuccessToast("Item updated successfully");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to update item");
    }
  };

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}

        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Item Manager</h1>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="p-2 border border-gray-300 rounded-lg w-64 text-gray-800"
              />
              <Link href="/request">
                <IconButton color="primary">
                  <Badge badgeContent={pendingCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Link>
            </div>
            <ItemForm
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              newItemQuantity={newItemQuantity}
              setNewItemQuantity={setNewItemQuantity}
              newItemDescription={newItemDescription}
              setNewItemDescription={setNewItemDescription}
              onSubmit={handleCreateItem}
            />

            <ItemList
              items={filteredItems}
              onDelete={handleDeleteItem}
              onEdit={editItem}
            />
          </div>
        </div>
      </Layout>
    </Protection>
  );
}
