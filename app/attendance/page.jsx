"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AttendanceForm from "../components/attendance_components/AttendanceForm";
import AttendanceHistory from "../components/attendance_components/AttendanceHistory";

import Protection from "../Protection";

import Layout from "../components/layout";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

export default function AttendanceManager() {
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAttendanceFormVisible, setAttendanceFormVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Updated history data:", historyData);
  }, [historyData]);

  const handleFetchStudents = async (batch, date, course) => {
    try {
      const response = await axios.get(`/api/student/attendance/batch`, {
        params: { batchName: batch, courseId: course, date: date },
      });

      const data = response.data;
      setStudents(data.students);
      console.log("Student data:", data.students);
      setAttendances(
        data.students.map((student) => ({
          studentId: student._id,
          date: date,
          status: "",
          courseId: course, // Use the selected course ID
        }))
      );
      showSuccessToast("Students fetched successfully");
    } catch (error) {
      console.error("Error fetching students:", error);
      showErrorToast("Error fetching students");
    }
  };

  const resetForm = () => {
    setStudents([]);
    setAttendances([]);
    setErrorMessage("");
    setAttendanceFormVisible(true);
  };

  const handleSaveAttendance = async (attendancesData) => {
    console.log("pleaseeeeeee", attendancesData);
    try {
      await axios.post(`/api/student/attendance/saveAttendance`, {
        attendances: attendancesData,
      });

      showSuccessToast("Attendance saved successfully");
      setErrorMessage("");
      setAttendanceFormVisible(false); // Close the form/modal on success
      resetForm(); // Reset the form after saving attendance
    } catch (error) {
      setAttendanceFormVisible(false); // Close the form/modal on success
      resetForm(); // Reset the form after saving attendance
      console.error("Error saving attendance:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while saving attendance."
      );
      showErrorToast("Error saving attendance");
    }
  };

  const handleFetchHistory = async (startDate, endDate, course) => {
    try {
      const response = await axios.get("/api/student/attendance/history", {
        params: { startDate, endDate, courseId: course },
      });

      const history = response.data.attendanceHistory || [];

      console.log("Attendance History:", history);
      setHistoryData(history);
      showSuccessToast("Attendance history fetched successfully");
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      showErrorToast("Error fetching attendance history");
    }
  };

  return (
    <Protection>
      <Layout>
        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-black text-center">
              Attendance Management
            </h1>
            {isAttendanceFormVisible && (
              <AttendanceForm
                students={students}
                attendances={attendances}
                setAttendances={setAttendances}
                onFetchStudents={handleFetchStudents}
                onSaveAttendance={handleSaveAttendance}
                errorMessage={errorMessage}
              />
            )}
            <AttendanceHistory
              historyData={historyData}
              onFetchHistory={handleFetchHistory}
            />
          </div>
        </div>
      </Layout>
    </Protection>
  );
}
