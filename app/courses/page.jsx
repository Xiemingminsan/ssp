// app/courses/page.js

"use client"; // Required for using hooks and client-side logic

import React, { useState, useEffect } from "react";
import CourseList from "../components/course_components/CourseList";
import CourseForm from "../components/course_components/CouseForm";
import Protection from "../Protection"; // Import the Protection component
import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      showErrorToast("Error fetching courses");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      console.log(newCourseName);
      await createCourse(newCourseName);
      setNewCourseName(""); // Reset the input after creation
      loadCourses();
      showSuccessToast("Course added successfully");
    } catch (error) {
      showErrorToast("Error creating course");
    }
  };

  const handleUpdateCourse = async (courseId, updatedCourseName) => {
    try {
      await updateCourse(courseId, updatedCourseName);
      loadCourses();
      showSuccessToast("Course updated successfully");
    } catch (error) {
      showErrorToast("Error updating course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      loadCourses();
      showSuccessToast("Course deleted successfully");
    } catch (error) {
      showErrorToast("Error deleting course");
    }
  };

  return (
    <Protection>
      <Layout>
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-black">
              Course Manager
            </h1>
            <CourseForm
              newCourseName={newCourseName}
              setNewCourseName={setNewCourseName}
              onSubmit={handleCreateCourse}
            />
            <CourseList
              courses={courses}
              onUpdate={handleUpdateCourse}
              onDelete={handleDeleteCourse}
            />
          </div>
        </div>
      </Layout>
    </Protection>
  );
}
