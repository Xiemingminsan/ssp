import dbConnect from "../../../../../dbConnect";
import Student from "../../../../../models/student";
import authenticate from "../../../../../auth"; // Correct import of the authenticate function

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

  try {
    const student = await Student.findById(id)
      .populate("batch")
      .populate("courses")
      .populate("attendance.course");
    if (!student) {
      return new Response(JSON.stringify({ message: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(student), {
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

export async function PUT(req, { params }) {
  const authData = await authenticate(req); // Authenticate the request

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = params;
  const {
    firstname,
    lastname,
    batch,
    batchname,
    profilepicture,
    birthdate,
    email,
    courses, // Update courses array
    attendance, // Update attendance records
  } = await req.json();

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        batch,
        batchname,
        profilepicture,
        birthdate,
        email,
        courses, // Update courses array
        attendance, // Update attendance records
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return new Response(JSON.stringify({ message: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "Student updated successfully",
        student: updatedStudent,
      }),
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

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return new Response(JSON.stringify({ message: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Student deleted successfully" }),
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
