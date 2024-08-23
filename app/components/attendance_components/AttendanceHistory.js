import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const AttendanceHistory = ({ historyData, onFetchHistory }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batch, setBatch] = useState("");
  const [course, setCourse] = useState("");
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  const handleCourseChange = (e) => {
    const selectedValue = e.target.value;
    const [courseId, courseName] = selectedValue.split("|");
    setCourse({ id: courseId, name: courseName });
  };

  useEffect(() => {
    // Fetch batches when the component mounts
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/student/batches");
        if (response.ok) {
          const data = await response.json();
          setBatches(data);
          console.log(data);
        } else {
          console.error("Failed to fetch batches, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    // Fetch courses whenever a batch is selected
    const fetchCourses = async () => {
      if (batch) {
        try {
          const response = await fetch(`/api/student/batches/courses/${batch}`);
          if (response.ok) {
            const data = await response.json();
            setCourses(data.courses || []);
          } else {
            console.error("Failed to fetch courses, status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      }
    };

    fetchCourses();
  }, [batch]);

  const handleFetchHistory = (e) => {
    e.preventDefault();
    onFetchHistory(startDate, endDate, course.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "Permission":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportToExcel = () => {
    const formattedData = historyData.map((student) => {
      const attendance = {};
      student.attendance.forEach((record) => {
        const date = new Date(record.date).toLocaleDateString();
        attendance[date] = record.status;
      });
      return {
        Name: `${student.firstname} ${student.lastname}`,
        ...attendance,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");

    XLSX.writeFile(workbook, "Attendance_History.xlsx");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Attendance History
      </h2>
      <form onSubmit={handleFetchHistory} className="mb-8">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="start-date"
            >
              Start Date
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="end-date"
            >
              End Date
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
                Select Batch
              </option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="course"
            >
              Course
            </label>
            <select
              id="course"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={`${course.id}|${course.name}`}
              onChange={handleCourseChange} // Use the new handler
              required
            >
              <option value="" disabled>
                Select Course
              </option>
              {courses.map((course) => (
                <option key={course._id} value={`${course._id}|${course.name}`}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Fetch History
        </button>
      </form>

      {historyData.length > 0 && (
        <div className="overflow-x-auto text-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Student Name
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Course
                </th>
                {historyData[0].attendance
                  .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort dates in ascending order
                  .map((record) => (
                    <th
                      key={record.date}
                      className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light"
                    >
                      {new Date(record.date).toLocaleDateString()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {historyData.map((student) =>
                student.attendance.length > 0 ? (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="py-4 px-6 border-b border-grey-light">
                      {`${student.firstname} ${student.lastname}`}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {student.attendance[0].courseName}
                    </td>
                    {student.attendance
                      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort dates in ascending order
                      .map((record) => (
                        <td
                          key={record._id}
                          className="py-4 px-6 border-b border-grey-light"
                        >
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                      ))}
                  </tr>
                ) : null
              )}
            </tbody>
          </table>

          <button
            onClick={exportToExcel}
            className="m-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
