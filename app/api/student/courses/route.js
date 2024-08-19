import dbConnect from "../../../../dbConnect";
import Course from "../../../../models/course";
import authenticate from "../../../../auth"; // Import the authenticate function

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req); // Authenticate the request

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, description } = await req.json();

  try {
    // Check if the course name already exists
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return new Response(
        JSON.stringify({ message: "Course name already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newCourse = new Course({
      name,
      description,
    });

    await newCourse.save();

    return new Response(
      JSON.stringify({ message: "Course created successfully" }),
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

  try {
    const courses = await Course.find();
    return new Response(JSON.stringify(courses), {
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
