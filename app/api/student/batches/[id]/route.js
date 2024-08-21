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
export async function PUT(req, { params }) {
  const authData = await authenticate(req); // Authenticate the request

  if (!authData || !["admin", "manager"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = params; // Batch ID
  const { course, action } = await req.json(); // The course ID and action from the request body

  // Validate the action field
  if (!action) {
    return new Response(JSON.stringify({ message: "Action is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const batch = await Batch.findById(id);
    if (!batch) {
      return new Response(JSON.stringify({ message: "Batch not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "add") {
      // Check if the course is already in the batch
      if (batch.courses.includes(course)) {
        return new Response(
          JSON.stringify({ message: "Course already added" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      batch.courses.push(course); // Add the course to the batch
      await batch.save(); // Save the updated batch

      return new Response(
        JSON.stringify({
          message: "Course added to batch successfully",
          batch,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (action === "remove") {
      // Check if the course is in the batch
      if (!batch.courses.includes(course)) {
        return new Response(
          JSON.stringify({ message: "Course not found in batch" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      batch.courses = batch.courses.filter(
        (courseId) => courseId.toString() !== course
      );
      await batch.save(); // Save the updated batch

      return new Response(
        JSON.stringify({
          message: "Course removed from batch successfully",
          batch,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(JSON.stringify({ message: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
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
