import React from "react";
import { useRouter } from "next/navigation"; // Use Next.js' useRouter

const CourseList = ({ courses, onDelete }) => {
  const router = useRouter(); // Use useRouter instead of useNavigate

  const handleNavigation = (path) => {
    router.push(path); // Navigate to the desired path
  };

  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.name}</h3>
          <button
            className="text-black"
            onClick={() => handleNavigation(`/courses/${course.id}`)}
          >
            View Course
          </button>
          <button onClick={() => onDelete(course.id)}>Delete Course</button>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
