import dbConnect from "../../../../../../dbConnect";
import Student from "../../../../../../models/student";
import authenticate from "../../../../../../auth";

export async function PUT(req, { params }) {
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
  const { courseId, date, status } = await req.json(); // Attendance details

  try {
    // Find the student and update their attendance
    const student = await Student.findByIdAndUpdate(
      id,
      {
        $push: {
          attendance: {
            course: courseId,
            date: new Date(date),
            status: status,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return new Response(JSON.stringify({ message: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Attendance updated successfully", student }),
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
