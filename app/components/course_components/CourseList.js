import React from "react";
import { useRouter } from "next/navigation"; // Use Next.js' useRouter

const CourseList = ({ courses, onDelete }) => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div>
      {courses.map((course) => (
        <div key={course.id} className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-black">{course.name}</h3>
            <p className="text-gray-600">{course.description}</p>
          </div>
          <div>
            <button
              className="text-red-500"
              onClick={() => onDelete(course._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
