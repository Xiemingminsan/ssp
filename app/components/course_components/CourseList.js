import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CourseList = ({ courses, onDelete }) => {
  return (
    <div className="space-y-4">
      {courses.length > 0 ? (
        courses.map((course) => (
          <div
            key={course._id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {course.name}
              </h3>
              <p className="text-gray-600">{course.description}</p>
              {course.batches && course.batches.length > 0 && (
                <p className="text-gray-500">
                  Batches: {course.batches.join(", ")}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <IconButton
                style={{ color: "red" }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => onDelete(course._id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No courses available.</p>
      )}
    </div>
  );
};

export default CourseList;
