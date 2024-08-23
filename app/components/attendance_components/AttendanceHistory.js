import React, { useState } from "react";
import * as XLSX from "xlsx";

const AttendanceHistory = ({ historyData, onFetchHistory }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFetchHistory = (e) => {
    e.preventDefault();
    onFetchHistory(startDate, endDate);
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
                {historyData[0].attendance.map((record) => (
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
              {historyData.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="py-4 px-6 border-b border-grey-light">
                    {`${student.firstname} ${student.lastname}`}
                  </td>
                  {student.attendance.map((record) => (
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
              ))}
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
