import dbConnect from "../../../../../dbConnect";
import Student from "../../../../../models/student";
import authenticate from "../../../../../auth";

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { course, attendanceRecords } = await req.json();

  try {
    if (!Array.isArray(attendanceRecords)) {
      throw new Error("attendanceRecords must be an array");
    }

    if (!course) {
      throw new Error("courseId and batchId are required");
    }

    for (const record of attendanceRecords) {
      const { studentId, date, status } = record;

      if (!studentId || !date || !status) {
        throw new Error(
          "studentId, date, and status are required in each attendance record"
        );
      }

      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error(`Student with ID ${studentId} not found`);
      }

      // Check for existing attendance on the same date for the same course
      const existingAttendance = student.attendance.find(
        (att) =>
          att.course &&
          att.course.toString() === course &&
          att.date.toISOString().split("T")[0] ===
            new Date(date).toISOString().split("T")[0]
      );

      if (existingAttendance) {
        return new Response(
          JSON.stringify({
            message: "Attendance for this course on this date already exists",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      student.attendance.push({
        course: course,
        date: new Date(date),
        status,
      });

      await student.save();
    }

    return new Response(
      JSON.stringify({ message: "Attendance marked successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
