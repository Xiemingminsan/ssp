import dbConnect from "../../../../../../../../dbConnect";
import Student from "../../../../../../../../models/student";
import authenticate from "../../../../../../../../auth"; // Import the authenticate function

export async function GET(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req); // Authenticate the request

  if (!authData || !["admin", "teacher"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { batchid, id } = params;

  try {
    const attendanceRecords = await Student.find({
      batch: batchid,
      "attendance.course": id,
    })
      .select("firstname lastname attendance")
      .populate({
        path: "attendance.course",
        match: { _id: id },
      });

    return new Response(JSON.stringify(attendanceRecords), {
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
