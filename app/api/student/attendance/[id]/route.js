import dbConnect from "../../../../../dbConnect";
import Student from "../../../../../models/student";
import authenticate from "../../../../../auth";

export async function PUT(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);
  if (!authData || !["admin", "teacher"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;
  const { status } = await req.json();

  try {
    const student = await Student.findOneAndUpdate(
      { "attendance._id": id },
      { $set: { "attendance.$.status": status } },
      { new: true, runValidators: true }
    );

    if (!student) {
      return new Response(
        JSON.stringify({ message: "Attendance record not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Attendance updated successfully" }),
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
