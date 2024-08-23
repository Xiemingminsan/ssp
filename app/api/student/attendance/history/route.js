import dbConnect from "../../../../../dbConnect";
import Student from "../../../../../models/student";
import authenticate from "../../../../../auth";

// GET /api/student/attendance/history?startDate=2024-08-01&endDate=2024-08-31
export async function GET(req) {
  console.log(req.params);
  await dbConnect();

  // Authenticate the user
  const authData = await authenticate(req);
  /*   if (!authData || !["admin", "teacher"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } */

  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  if (!startDateParam || !endDateParam) {
    return new Response(
      JSON.stringify({ message: "Start date and end date are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const startDate = new Date(startDateParam);
  const endDate = new Date(endDateParam);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return new Response(JSON.stringify({ message: "Invalid date format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Log dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Find students with attendance records within the specified date range
    const students = await Student.find({
      "attendance.date": { $gte: startDate, $lte: endDate },
    });

    // Log the retrieved students for debugging
    console.log("Found Students:", students);

    const attendanceHistory = students.map((student) => ({
      studentId: student._id,
      firstname: student.firstname,
      lastname: student.lastname,
      attendance: student.attendance.filter(
        (record) => record.date >= startDate && record.date <= endDate
      ),
    }));

    // Log the attendance history for debugging
    console.log("Attendance History:", attendanceHistory);

    return new Response(JSON.stringify({ attendanceHistory }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
