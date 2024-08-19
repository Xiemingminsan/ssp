// app/attendance/page.js

"use client"; // Required for using hooks and client-side logic

import React, { useState } from "react";
import AttendanceForm from "../../components/attendance_components/AttendanceForm";
import AttendanceHistory from "../../components/attendance_components/AttendanceHistory";
import {
  fetchStudents,
  saveAttendance,
  getAttendanceHistory,
} from "../../services/attendanceServices";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";

export default function AttendanceManager() {
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFetchStudents = async (batch, date) => {
    try {
      const data = await fetchStudents(batch, date);
      console.log(data);
      setStudents(data.students);
      setAttendances(
        data.students.map((student) => ({
          studentId: student._id,
          date: data.date,
          status: "",
          courseId: "66b106cd29f98734ace49374", // This would likely come from somewhere dynamic in a real app
        }))
      );
      showSuccessToast("Students fetched successfully");
    } catch (error) {
      console.error("Error fetching students:", error);
      showErrorToast("Error fetching students");
    }
  };

  const handleSaveAttendance = async (attendancesData) => {
    try {
      await saveAttendance(attendancesData);
      showSuccessToast("Attendance saved successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Error saving attendance:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred while saving attendance.");
      }
      showErrorToast("Error saving attendance");
    }
  };

  const handleFetchHistory = async (startDate, endDate) => {
    try {
      const data = await getAttendanceHistory(startDate, endDate);
      setHistoryData(data);
      showSuccessToast("Attendance history fetched successfully");
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      showErrorToast("Error fetching attendance history");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
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
  );
}
