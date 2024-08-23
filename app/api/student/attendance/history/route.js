import Course from "../../../../../models/course";
import Student from "../../../../../models/student";
import dbConnect from "../../../../../dbConnect";
import authenticate from "../../../../../auth";

export async function GET(req) {
  await dbConnect();

  // Authenticate the user
  const authData = await authenticate(req);

  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const courseIdParam = searchParams.get("courseId"); // Get courseId from the query

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
    const course = await Course.findById(courseIdParam, "name");

    // Find students with attendance records within the specified date range and course
    const students = await Student.find({
      "attendance.course": courseIdParam,
      "attendance.date": { $gte: startDate, $lte: endDate },
    });

    const attendanceHistory = students.map((student) => ({
      studentId: student._id,
      firstname: student.firstname,
      lastname: student.lastname,
      attendance: student.attendance
        .filter(
          (record) =>
            record.date >= startDate &&
            record.date <= endDate &&
            record.course.toString() === courseIdParam
        )
        .map((record) => ({
          ...record._doc,
          courseName: course.name, // Manually add the course name here
        })),
    }));

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
