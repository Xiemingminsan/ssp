import React from "react";
import { useNavigate } from "react-router-dom";

const CourseList = ({ courses, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (courseId) => {
    navigate(`/EditCourse/${courseId}`);
  };

  return (
    <ul className="space-y-4">
      {courses.map((course) => (
        <li
          key={course._id}
          className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow"
        >
          <span className="font-medium">{course.name}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(course._id, course.name)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(course._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CourseList;
