import dbConnect from "../../../../dbConnect";
import Course from "../../../../models/course";
import authenticate from "../../../../auth"; // Import the authenticate function
import Batch from "../../../../models/batch";

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

    const savedCourse = await newCourse.save();

    return new Response(
      JSON.stringify({
        message: "Course created successfully",
        course: savedCourse,
      }),
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
  const authData = await authenticate(req);

  if (!authData || !["admin", "manager", "user"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  try {
    // Fetch all courses and populate the batches that include each course
    const courses = await Course.find().lean();
    const batches = await Batch.find().populate("courses");

    // Add batch names to each course
    const coursesWithBatches = courses.map((course) => {
      const courseBatches = batches
        .filter((batch) => batch.courses.some((c) => c.equals(course._id)))
        .map((batch) => batch.name);

      return { ...course, batches: courseBatches };
    });

    return new Response(JSON.stringify(coursesWithBatches), {
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
