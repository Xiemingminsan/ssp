import dbConnect from "../../../../../dbConnect";
import Batch from "../../../../../models/batch";
import Student from "../../../../../models/student";
import authenticate from "../../../../../auth";

export async function GET(req, { params }) {
  const authData = await authenticate(req); // Authenticate the request

  if (!authData || !["admin", "manager", "user"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = params;
  console.log(id);

  try {
    const batch = await Batch.findById(id);
    console.log(batch);

    if (!batch) {
      return new Response(JSON.stringify({ message: "Batch not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(batch), {
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

export async function DELETE(req, { params }) {
  const authData = await authenticate(req); // Authenticate the request

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = params;
  console.log(id);
  try {
    const enrolledStudents = await Student.find({ batch: id });
    if (enrolledStudents.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete course. Students are enrolled.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const deletedBatch = await Batch.findByIdAndDelete(id);

    if (!deletedBatch) {
      return new Response(JSON.stringify({ message: "Batch not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Batch deleted successfully" }),
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
