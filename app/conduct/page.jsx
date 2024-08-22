/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ConductList from "../components/conduct_components/ConductList";
import EditConduct from "../components/conduct_components/EditConduct";
import Protection from "../Protection";
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { Button } from "@mui/material";
import LoadingScreen from "../components/LoadingScreen";

export default function ConductManager() {
  const [conducts, setConducts] = useState([]);
  const [filteredConducts, setFilteredConducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConduct, setSelectedConduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add this state

  useEffect(() => {
    loadConducts();
  }, []);

  const loadConducts = async () => {
    try {
      setLoading(true); // Start loading
      const fetchedConducts = await fetchConducts();
      setConducts(fetchedConducts);
      setFilteredConducts(fetchedConducts); // Initially display all conducts
    } catch (error) {
      showErrorToast("Error fetching conducts");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchConducts = async () => {
    try {
      const response = await axios.get("/api/conduct");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch conducts"
      );
    }
  };

  const createConduct = async (
    person,
    action,
    reason,
    punishment,
    punishmentEndDate
  ) => {
    try {
      await axios.post("/api/conduct", {
        person,
        action,
        reason,
        punishment,
        punishmentEndDate,
      });
      loadConducts(); // Reload conducts after adding a new one
      showSuccessToast("Conduct added successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to create conduct"
      );
    }
  };

  const updateConduct = async (
    conductId,
    person,
    action,
    reason,
    punishment,
    punishmentEndDate
  ) => {
    try {
      await axios.put(`/api/conduct/${conductId}`, {
        person,
        action,
        reason,
        punishment,
        punishmentEndDate,
      });
      loadConducts(); // Reload conducts after updating
      showSuccessToast("Conduct updated successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to update conduct"
      );
    }
  };

  const deleteConduct = async (conductId) => {
    try {
      await axios.delete(`/api/conduct/${conductId}`);
      loadConducts();
      showSuccessToast("Conduct deleted successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to delete conduct"
      );
    }
  };

  const handleCreateOrUpdateConduct = async (
    person,
    action,
    reason,
    punishment,
    punishmentEndDate
  ) => {
    try {
      if (selectedConduct) {
        await updateConduct(
          selectedConduct._id,
          person,
          action,
          reason,
          punishment,
          punishmentEndDate
        );
      } else {
        await createConduct(
          person,
          action,
          reason,
          punishment,
          punishmentEndDate
        );
      }
      closeModal();
    } catch (error) {
      showErrorToast("Failed to save conduct");
    }
  };

  const handleDeleteConduct = async (conductId) => {
    try {
      await deleteConduct(conductId);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const filterConducts = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = conducts.filter((conduct) => {
      return (
        conduct.person.toLowerCase().includes(lowercasedFilter) ||
        conduct.action.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredConducts(filteredData);
  };

  useEffect(() => {
    filterConducts();
  }, [searchTerm, conducts]);

  const openModal = (conduct = null) => {
    setSelectedConduct(conduct);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConduct(null);
  };

  return (
    <Protection>
      <Layout>
        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Conduct Manager
              </h1>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conducts..."
                className="p-2 border border-gray-300 rounded-lg w-64 text-gray-800"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => openModal()}
              >
                Add Conduct
              </Button>
            </div>

            <ConductList
              conducts={filteredConducts}
              onDelete={handleDeleteConduct}
              onEdit={(conduct) => openModal(conduct)}
            />
          </div>
        </div>

        {isModalOpen && (
          <EditConduct
            isOpen={isModalOpen}
            conductData={selectedConduct}
            onEdit={handleCreateOrUpdateConduct}
            onClose={closeModal}
          />
        )}
      </Layout>
    </Protection>
  );
}
