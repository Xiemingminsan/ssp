"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseList from "../components/course_components/CourseList";
import CourseForm from "../components/course_components/CouseForm";
import Protection from "../Protection";
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import LoadingScreen from "../components/LoadingScreen";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [batches, setBatches] = useState([]); // State to hold batch data
  const [loading, setLoading] = useState(true); // Add this state

  useEffect(() => {
    loadCourses();
    fetchBatches(); // Fetch batches when the component loads
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true); // Start loading
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
      setFilteredCourses(fetchedCourses); // Initially display all courses
    } catch (error) {
      showErrorToast("Error fetching courses");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/student/courses");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get("/api/student/batches");
      setBatches(response.data); // Store fetched batches
    } catch (error) {
      showErrorToast("Error fetching batches");
    }
  };

  const createCourse = async (
    courseName,
    courseDescription,
    selectedBatches
  ) => {
    try {
      const courseResponse = await axios.post("/api/student/courses", {
        name: courseName,
        description: courseDescription,
      });

      const courseId = courseResponse.data.course._id;
      console.log("Course ID:", courseId);
      console.log("Selected Batches:", selectedBatches);

      if (!courseId) {
        throw new Error("Course ID is undefined. Check API response.");
      }

      if (selectedBatches.length > 0) {
        for (const batchId of selectedBatches) {
          await axios.put(`/api/student/batches/${batchId}`, {
            course: courseId,
            action: "add",
          });
        }
        console.log(selectedBatches);
        loadCourses(); // Reload courses after adding a new one
        showSuccessToast("Course added successfully with selected batches");
      } else {
        loadCourses(); // Reload courses after adding a new one
        showSuccessToast("Course added successfully");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to create course"
      );
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`/api/student/courses/${courseId}`);
      loadCourses();
      showSuccessToast("Course deleted successfully");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  };

  const handleCreateCourse = async () => {
    try {
      await createCourse(newCourseName, newCourseDescription, selectedBatches);
      setNewCourseName(""); // Reset the input after creation
      setNewCourseDescription(""); // Reset description after creation
      setSelectedBatches([]); // Reset batches after creation
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const filterCourses = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = courses.filter((course) => {
      return (
        course.name.toLowerCase().includes(lowercasedFilter) ||
        (course.description ?? "").toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredCourses(filteredData);
  };

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <div className="min-h-screen p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Course Manager
              </h1>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="p-2 border border-gray-300 rounded-lg w-64 text-gray-800"
              />
            </div>
            <CourseForm
              newCourseName={newCourseName}
              setNewCourseName={setNewCourseName}
              newCourseDescription={newCourseDescription}
              setNewCourseDescription={setNewCourseDescription}
              selectedBatches={selectedBatches}
              setSelectedBatches={setSelectedBatches}
              onSubmit={handleCreateCourse}
              batches={batches} // Pass the fetched batches to CourseForm
            />
            <CourseList
              courses={filteredCourses}
              onDelete={handleDeleteCourse}
            />
          </div>
        </div>
      </Layout>
    </Protection>
  );
}
