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

  useEffect(() => {
    console.log("Updated history data:", historyData);
  }, [historyData]);

  const handleFetchStudents = async (batch, date) => {
    try {
      const response = await axios.get(`/api/student/attendance/batch`, {
        params: { batchName: batch },
      });

      const data = response.data;
      setStudents(data.students);
      console.log("Student data:", data.students);
      setAttendances(
        data.students.map((student) => ({
          studentId: student._id,
          date: date,
          status: "",
          courseId: "66b106cd29f98734ace49374",
        }))
      );
      showSuccessToast("Students fetched successfully");
    } catch (error) {
      console.error("Error fetching students:", error);
      showErrorToast("Error fetching students");
    }
  };

  const handleSaveAttendance = async (attendancesData) => {
    console.log(attendancesData);
    try {
      await axios.post(`/api/student/attendance/saveAttendance`, {
        attendances: attendancesData,
      });

      showSuccessToast("Attendance saved successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Error saving attendance:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while saving attendance."
      );
      showErrorToast("Error saving attendance");
    }
  };

  const handleFetchHistory = async (startDate, endDate) => {
    try {
      const response = await axios.get("/api/student/attendance/history", {
        params: { startDate, endDate },
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
            <AttendanceForm
              students={students}
              attendances={attendances}
              setAttendances={setAttendances}
              onFetchStudents={handleFetchStudents}
              onSaveAttendance={handleSaveAttendance}
              errorMessage={errorMessage}
            />
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
