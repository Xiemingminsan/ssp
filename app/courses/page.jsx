"use client"; // Required for using hooks and client-side logic

import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseList from "../components/course_components/CourseList";
import CourseForm from "../components/course_components/CouseForm"; // Corrected import path
import Protection from "../Protection"; // Import the Protection component
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const loadCourses = async () => {
    try {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
      setFilteredCourses(fetchedCourses); // Initially display all courses
    } catch (error) {
      showErrorToast("Error fetching courses");
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

  const createCourse = async (courseName, courseDescription) => {
    try {
      await axios.post("/api/student/courses", {
        name: courseName,
        description: courseDescription,
      });
      loadCourses(); // Reload courses after adding a new one
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create course"
      );
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`/api/student/courses/${courseId}`);
      loadCourses();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse(newCourseName, newCourseDescription);
      setNewCourseName(""); // Reset the input after creation
      setNewCourseDescription(""); // Reset description after creation
      showSuccessToast("Course added successfully");
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      showSuccessToast("Course deleted successfully");
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
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-black">
              Course Manager
            </h1>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses"
              className="mb-4 p-2 border border-gray-300 rounded text-black w-full"
            />
            <CourseForm
              newCourseName={newCourseName}
              setNewCourseName={setNewCourseName}
              newCourseDescription={newCourseDescription}
              setNewCourseDescription={setNewCourseDescription}
              onSubmit={handleCreateCourse}
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
