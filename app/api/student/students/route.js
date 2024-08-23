import dbConnect from "../../../../dbConnect";
import Student from "../../../../models/student";
import Batch from "../../../../models/batch";
import authenticate from "../../../../auth";

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const {
    firstname,
    lastname,
    batch,
    profilepicture,
    birthdate,
    email,
    courses,
    attendance,
  } = await req.json();

  try {
    const existingStudent = await Student.findOne({ email });
    const existStudent = await Student.findOne({ birthdate });
    if (existingStudent && existStudent) {
      return new Response(
        JSON.stringify({ message: "Email or Birthdate already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const batchData = await Batch.findById(batch);
    if (!batchData) {
      return new Response(JSON.stringify({ message: "Invalid batch ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newStudent = new Student({
      firstname,
      lastname,
      batch,
      profilepicture,
      birthdate,
      email,
      courses,
      attendance,
    });

    await newStudent.save();

    return new Response(
      JSON.stringify({ message: "Student registered successfully" }),
      {
        status: 201,
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

export async function GET(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const students = await Student.find()
      .populate("batch")
      .populate("courses")
      .populate("attendance.course");

    return new Response(JSON.stringify(students), {
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
