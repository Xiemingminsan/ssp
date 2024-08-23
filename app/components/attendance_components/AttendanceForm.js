"use client"; // Ensure this file is treated as a client component in Next.js

import { useState, useEffect } from "react";

const AttendanceForm = ({
  students,
  attendances,
  setAttendances,
  onFetchStudents,
  onSaveAttendance,
  errorMessage,
}) => {
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState("");
  const [batches, setBatches] = useState([]);

  const handleFetchStudents = (e) => {
    e.preventDefault();
    onFetchStudents(batch, date);
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/student/batches");

        if (response.ok) {
          const data = await response.json(); // Parse the response as JSON

          // Debugging: Log the entire data object to ensure it is received correctly
          console.log("Fetched data:", data);

          // Check if data is an array and has items
          if (Array.isArray(data) && data.length > 0) {
            // Extract batch names and log them
            const batchNames = data.map((batch) => batch.name);
            console.log("Batch names:", batchNames);

            // Set the fetched data to state
            setBatches(data);
          } else {
            console.warn(
              "No batches found or data is not in the expected format"
            );
          }
        } else {
          console.error("Failed to fetch batches, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []);

  const handleAttendanceChange = (index, status) => {
    const newAttendances = [...attendances];
    newAttendances[index].status = status;
    setAttendances(newAttendances);
  };

  const handleSaveAttendance = () => {
    onSaveAttendance(attendances);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Take Attendance</h2>
      <form onSubmit={handleFetchStudents} className="mb-8">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="batch"
            >
              Batch
            </label>
            <select
              id="batch"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
            >
              <option value="" disabled>
                Select batch
              </option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch.name}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Fetch Students
        </button>
      </form>

      {errorMessage && (
        <div className="mb-4 text-red-500 font-bold">{errorMessage}</div>
      )}

      {students.length > 0 && (
        <div className="overflow-x-auto text-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Name
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Present
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Absent
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Late
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Permission
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 border-b border-grey-light">{`${student.firstname} ${student.middlename}`}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      onClick={() => handleAttendanceChange(index, "Present")}
                      className={`w-8 h-8 rounded-full focus:outline-none ${
                        attendances[index].status === "Present"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-green-200"
                      }`}
                    >
                      {attendances[index].status === "Present" ? "✔" : "-"}
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      onClick={() => handleAttendanceChange(index, "Absent")}
                      className={`w-8 h-8 rounded-full focus:outline-none ${
                        attendances[index].status === "Absent"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-red-200"
                      }`}
                    >
                      {attendances[index].status === "Absent" ? "✖" : "-"}
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      onClick={() => handleAttendanceChange(index, "Late")}
                      className={`w-8 h-8 rounded-full focus:outline-none ${
                        attendances[index].status === "Late"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-yellow-200"
                      }`}
                    >
                      {attendances[index].status === "Late" ? "◯" : "-"}
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      onClick={() =>
                        handleAttendanceChange(index, "Permission")
                      }
                      className={`w-8 h-8 rounded-full focus:outline-none ${
                        attendances[index].status === "Permission"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-blue-200"
                      }`}
                    >
                      {attendances[index].status === "Permission" ? "⚲" : "-"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {students.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleSaveAttendance}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceForm;
