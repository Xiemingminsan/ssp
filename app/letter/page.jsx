"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import LetterList from "../components/letter_components/LetterList";
import EditLetter from "../components/letter_components/EditLetter";
import LoadingScreen from "../components/LoadingScreen";
import Protection from "../Protection";
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { Button, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Link from "next/link";

export default function LetterManager() {
  const [letters, setLetters] = useState([]);
  const [filteredLetters, setFilteredLetters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true); // Add this state

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      setLoading(true); // Start loading
      const fetchedLetters = await fetchLetters();
      setLetters(fetchedLetters);
      setFilteredLetters(fetchedLetters); // Initially display all letters
    } catch (error) {
      showErrorToast("Error fetching letters");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchLetters = async () => {
    try {
      const response = await axios.get("/api/letters");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch letters"
      );
    }
  };

  const createLetter = async (
    subject,
    sender,
    receiver,
    date,
    description,
    status
  ) => {
    try {
      await axios.post("/api/letters", {
        subject,
        sender,
        receiver,
        date,
        description,
        status,
      });
      loadLetters(); // Reload letters after adding a new one
      showSuccessToast("Letter added successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to create letter"
      );
    }
  };

  const updateLetter = async (
    letterId,
    subject,
    sender,
    receiver,
    date,
    description,
    status
  ) => {
    try {
      await axios.put(`/api/letters/${letterId}`, {
        subject,
        sender,
        receiver,
        date,
        description,
        status,
      });
      loadLetters(); // Reload letters after updating
      showSuccessToast("Letter updated successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to update letter"
      );
    }
  };

  const deleteLetter = async (letterId) => {
    try {
      await axios.delete(`/api/letters/${letterId}`);
      loadLetters();
      showSuccessToast("Letter deleted successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to delete letter"
      );
    }
  };

  const handleCreateOrUpdateLetter = async (
    subject,
    sender,
    receiver,
    date,
    description,
    status
  ) => {
    try {
      if (selectedLetter) {
        await updateLetter(
          selectedLetter._id,
          subject,
          sender,
          receiver,
          date,
          description,
          status
        );
      } else {
        await createLetter(
          subject,
          sender,
          receiver,
          date,
          description,
          status
        );
      }
      closeModal();
    } catch (error) {
      showErrorToast("Failed to save letter");
    }
  };

  const handleDeleteLetter = async (letterId) => {
    try {
      await deleteLetter(letterId);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const filterLetters = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = letters.filter((letter) => {
      return (
        letter.subject.toLowerCase().includes(lowercasedFilter) ||
        letter.sender.toLowerCase().includes(lowercasedFilter) ||
        letter.receiver.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredLetters(filteredData);
  };

  useEffect(() => {
    filterLetters();
  }, [searchTerm, letters]);

  const openModal = (letter = null) => {
    setSelectedLetter(letter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLetter(null);
  };

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Letter Manager
              </h1>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search letters..."
                className="p-2 border border-gray-300 rounded-lg w-64 text-gray-800"
              />
              <Link href="/letter-requests">
                <IconButton color="primary">
                  <Badge badgeContent={pendingCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Link>
              <Button
                variant="contained"
                color="primary"
                onClick={() => openModal()}
              >
                Add Letter
              </Button>
            </div>

            <LetterList
              letters={filteredLetters}
              onDelete={handleDeleteLetter}
              onEdit={(letter) => openModal(letter)}
            />
          </div>
        </div>

        {isModalOpen && (
          <EditLetter
            isOpen={isModalOpen}
            letterData={selectedLetter}
            onEdit={handleCreateOrUpdateLetter}
            onClose={closeModal}
          />
        )}
      </Layout>
    </Protection>
  );
}
