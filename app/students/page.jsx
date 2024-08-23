"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Protection from "../Protection";
import Layout from "../components/layout";
import { Edit, Trash, Search } from "lucide-react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
  Pagination,
  Card,
  CardContent,
  SvgIcon,
  Modal,
} from "@mui/material";
import { School, People } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import StudentForm from "../students/registrationForm/page";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import LoadingScreen from "../components/LoadingScreen";
import Image from "next/image";

const RECORDS_PER_PAGE = 8;

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("firstname");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get("/api/student/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false); // Start loading
      }
    };
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  useEffect(() => {}, [selectedStudent]);
  console.log(selectedStudent);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = async (student) => {
    console.log("Deleting student:", student._id);
    try {
      const response = await axios.delete(
        `/api/student/students/${student._id}`
      );
      if (response.status === 200) {
        showSuccessToast("Student deleted successfully");
        setStudents((prevStudents) =>
          prevStudents.filter((s) => s._id !== student._id)
        );
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      showErrorToast("Error deleting student. Please try again.");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const handleSaveEdit = async (editedStudent) => {
    console.log("Saving edited student:", editedStudent);
    try {
      const response = await axios.put(
        `/api/student/students/${editedStudent._id}`,
        editedStudent
      );
      if (response.status === 200) {
        const updatedStudents = students.map((student) =>
          student._id === editedStudent._id ? editedStudent : student
        );
        setStudents(updatedStudents);
        handleCloseModal();
        showSuccessToast("Student updated successfully");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      showErrorToast("Error updating student. Please try again.");
    }
  };
  const filteredStudents = students.filter((student) =>
    `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedStudents = filteredStudents.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student) => student.status === "active"
  ).length;
  const totalBatches = new Set(students.map((student) => student.batchname))
    .size;
  const graduatingStudents = students.filter(
    (student) => new Date().getFullYear() === student.graduationyear
  ).length;

  return (
    <Protection>
      <Layout>
        {loading && <LoadingScreen />}
        <Box sx={{ p: 4, bgcolor: "#fff", minHeight: "100vh" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#5e35b1", fontWeight: "bold" }}
          >
            Students
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Card sx={{ flex: 1, bgcolor: "#fff", boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography color="textSecondary" gutterBottom>
                    Total Students
                  </Typography>
                  <SvgIcon
                    component={People}
                    sx={{ color: "blue", width: "40px", height: "40px" }}
                  />
                </Box>
                <Typography variant="h4">{totalStudents}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, bgcolor: "#fff", boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography color="textSecondary" gutterBottom>
                    Active Students
                  </Typography>
                  <Typography variant="h4">{activeStudents}</Typography>
                  <SvgIcon
                    component={People}
                    sx={{ color: "blue", width: "40px", height: "40px" }}
                  />
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, bgcolor: "#fff", boxShadow: 3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Batches
                </Typography>
                <Typography variant="h4">{totalBatches}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, bgcolor: "#fff", boxShadow: 3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Graduating Students
                </Typography>
                <Typography variant="h4">{graduatingStudents}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              placeholder="Search...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx />
                  </InputAdornment>
                ),
                sx: { height: "36px" },
              }}
              sx={{ width: "250px", bgcolor: "#fff" }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/students/registrationForm")}
              sx={{
                bgcolor: "#5e35b1",
                borderRadius: "12px",
                padding: "8px 16px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                textTransform: "none",
              }}
            >
              Create New Student
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, mb: 2, borderRadius: "8px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#444",
                      borderRadius: "8px 0 0 8px",
                    }}
                  >
                    Profile Picture
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#444" }}>
                    <TableSortLabel
                      active={sortField === "firstname"}
                      direction={sortDirection}
                      onClick={() => handleSort("firstname")}
                    >
                      First Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#444" }}>
                    <TableSortLabel
                      active={sortField === "lastname"}
                      direction={sortDirection}
                      onClick={() => handleSort("lastname")}
                    >
                      Last Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#444" }}>
                    <TableSortLabel
                      active={sortField === "batchname"}
                      direction={sortDirection}
                      onClick={() => handleSort("batchname")}
                    >
                      Batch
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#444",
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow
                    key={student._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell>
                      {student.profilepicture ? (
                        <Image
                          src={student.profilepicture}
                          alt={`${student.firstname} ${student.lastname}`}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            bgcolor: "gray",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          {student.firstname.charAt(0).toUpperCase()}
                          {student.lastname.charAt(0).toUpperCase()}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "500", color: "#666" }}>
                      {student.firstname}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "500", color: "#666" }}>
                      {student.lastname}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "500", color: "#666" }}>
                      {student.batchname}
                    </TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(student)}
                        size="small"
                      >
                        <Edit fontSize="small" color="blue" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(student)}
                        size="small"
                      >
                        <Trash fontSize="small" color="red" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(filteredStudents.length / RECORDS_PER_PAGE)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>

          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="edit-student-modal-title"
            aria-describedby="modal-to-edit-student-information"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: 800,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "5px",
              }}
            >
              <Typography
                id="edit-student-modal-title"
                variant="h6"
                component="h2"
                gutterBottom
              >
                Edit Student
              </Typography>
              {selectedStudent && (
                <StudentForm
                  initialData={selectedStudent}
                  onSubmit={handleSaveEdit}
                  onCancel={handleCloseModal}
                />
              )}
            </Box>
          </Modal>
        </Box>
      </Layout>
    </Protection>
  );
};

export default StudentListPage;
