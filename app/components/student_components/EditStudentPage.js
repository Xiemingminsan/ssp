import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StudentForm from "./StudentForm";

const EditStudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/students/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student", error);
      }
    };

    fetchStudent();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await axios.put(`/api/students/${id}`, data);
      history.push("/students");
    } catch (error) {
      console.error("Error updating student", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Student</h1>
      {student && <StudentForm initialData={student} onSubmit={handleUpdate} />}
    </div>
  );
};

export default EditStudentPage;
