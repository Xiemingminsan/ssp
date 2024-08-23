import axios from "axios";

export const fetchCourses = async () => {
  const response = await axios.get("/api/courses");
  return response.data;
};

export const createCourse = async (courseName) => {
  const response = await axios.post("/api/courses", { courseName });
  return response.data;
};

export const deleteCourse = async (courseId) => {
  await axios.delete(`/api/courses/${courseId}`);
};

export const updateCourse = async (courseId, courseName) => {
  await axios.put(`/api/courses/${courseId}`, { courseName });
};
