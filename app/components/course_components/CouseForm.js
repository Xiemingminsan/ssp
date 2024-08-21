import React from "react";
import Select from "react-select";

const CourseForm = ({
  newCourseName,
  setNewCourseName,
  newCourseDescription,
  setNewCourseDescription,
  selectedBatches,
  setSelectedBatches,
  onSubmit,
  batches, // Batches are passed as a prop
}) => {
  const handleBatchSelection = (selectedOptions) => {
    setSelectedBatches(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newCourseName, newCourseDescription, selectedBatches);
  };

  // Convert batches to options format for react-select
  const batchOptions = batches.map((batch) => ({
    value: batch._id,
    label: batch.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="flex space-x-4">
        <input
          type="text"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          placeholder="New course name"
          className="flex-grow p-2 border border-gray-300 rounded-lg text-gray-800"
        />
        <input
          type="text"
          value={newCourseDescription}
          onChange={(e) => setNewCourseDescription(e.target.value)}
          placeholder="Course description"
          className="flex-grow p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Select Batch:</label>
        <Select
          isMulti
          options={batchOptions}
          value={batchOptions.filter((option) =>
            selectedBatches.includes(option.value)
          )}
          onChange={handleBatchSelection}
          className="text-black"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-48"
      >
        Add Course
      </button>
    </form>
  );
};

export default CourseForm;
