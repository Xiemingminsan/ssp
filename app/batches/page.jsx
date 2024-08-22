"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Protection from "../Protection";
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import LoadingScreen from "../components/LoadingScreen";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BatchManager() {
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/student/batches");
      setBatches(response.data);
    } catch (error) {
      showErrorToast("Error fetching batches");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async (batchId, courseId) => {
    try {
      await axios.put(`/api/student/batches/${batchId}`, {
        course: courseId,
        action: "remove",
      });
      loadBatches();
      showSuccessToast("Course removed successfully");
    } catch (error) {
      showErrorToast("Error removing course");
    }
  };

  const filterBatches = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return batches.filter((batch) =>
      batch.name.toLowerCase().includes(lowercasedFilter)
    );
  };

  const filteredBatches = filterBatches();

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Batch Manager
              </h1>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batches..."
                className="p-2 border border-gray-300 rounded-lg w-64 text-gray-800"
              />
            </div>
            <div>
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <Accordion key={batch._id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <h3 className="text-xl font-semibold text-gray-800">{`${batch.name} (${batch.courses.length} courses)`}</h3>
                    </AccordionSummary>
                    <AccordionDetails>
                      {batch.courses.length > 0 ? (
                        batch.courses.map((course) => (
                          <div
                            key={course._id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <p className="text-gray-500">{course.name}</p>
                            <IconButton
                              style={{ color: "red" }}
                              onClick={() =>
                                handleRemoveCourse(batch._id, course._id)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        ))
                      ) : (
                        <span>No courses available.</span>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <span className="text-center" color="textSecondary">
                  No batches available.
                </span>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Protection>
  );
}
