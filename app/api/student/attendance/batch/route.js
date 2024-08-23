import dbConnect from "../../../../../dbConnect";
import Student from "../../../../..//models/student";
import authenticate from "../../../../../auth";

// GET /api/student/attendance/batch?batchName=Batch+1
export async function GET(req) {
  await dbConnect();

  // Authenticate the user
  const authData = await authenticate(req);
  if (!authData || !["admin", "teacher"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(req.url);
  const batchName = searchParams.get("batchName");

  if (!batchName) {
    return new Response(JSON.stringify({ message: "Batch name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Find students with the specified batch name
    const students = await Student.find({ batchname: batchName });

    if (students.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No students found for the specified batch",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ students }), {
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
