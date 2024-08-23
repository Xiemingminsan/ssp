import dbConnect from "../../../../../dbConnect";
import Student from "../../../../../models/student";

// Named export for POST request
export async function POST(req) {
  await dbConnect();

  try {
    const { attendances } = await req.json(); // Use req.json() to parse JSON body

    for (const attendance of attendances) {
      const { studentId, date, status, course } = attendance;
      const attendanceDate = new Date(date);

      // Find the student by ID
      const student = await Student.findById(studentId);

      if (!student) {
        return new Response(JSON.stringify({ message: "Student not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check if the attendance for the given date already exists
      const existingAttendance = student.attendance.find(
        (att) =>
          att.date.toISOString() === attendanceDate.toISOString() &&
          att.course.toString() === course
      );

      if (existingAttendance) {
        // Update existing attendance
        existingAttendance.status = status;
      } else {
        // Add new attendance record
        student.attendance.push({ date: attendanceDate, status, course });
      }

      // Save the student record with updated attendance
      await student.save();
    }

    return new Response(
      JSON.stringify({ message: "Attendance updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
