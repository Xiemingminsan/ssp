import React from "react";

const displaycourseName = (courseName) => {
  console.log(courseName);
};

const CourseForm = ({ newCourseName, setNewCourseName, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mb-6 flex space-x-4">
      <input
        type="text"
        value={newCourseName}
        onChange={(e) => setNewCourseName(e.target.value)}
        placeholder="New course name"
        className="flex-grow p-2 border border-gray-300 rounded text-black"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Course
      </button>
    </form>
  );
};

export default CourseForm;
