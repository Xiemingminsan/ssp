import dbConnect from "../../../../../dbConnect";
import Student from "../../../../../models/student";
import authenticate from "../../../../../auth";

// GET /api/student/attendance/[id]
export async function GET(req, { params }) {
  await dbConnect();

  // Authenticate the user
  const authData = await authenticate(req);
  if (!authData || !["admin", "teacher"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params; // Student ID

  try {
    // Find the student and populate course references in attendance
    const student = await Student.findById(id).populate("attendance.course");

    if (!student) {
      return new Response(JSON.stringify({ message: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ attendance: student.attendance }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
