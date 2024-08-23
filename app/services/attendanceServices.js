import axios from "axios";

const API_URL = "/api/attendance";

export const fetchStudents = async (batch, date) => {
  const response = await axios.post(`${API_URL}/fetchStudents`, {
    batch,
    date,
  });
  return response.data;
};

export const saveAttendance = async (attendances) => {
  const response = await axios.post(`${API_URL}/saveAttendance`, {
    attendances,
  });
  return response.data;
};

export const getAttendanceHistory = async (startDate, endDate) => {
  const response = await axios.get(`${API_URL}/history`, {
    params: { startDate, endDate },
  });
  return response.data;
};
