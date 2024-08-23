import dbConnect from "../../../dbConnect";
import Hierarchy from "../../../models/management";
import authenticate from "../../../auth";

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json(); // Parse the JSON body
    const { name, role, phone, description, isActive, photo } = body;

    const newHierarchy = new Hierarchy({
      name,
      role,
      phone,
      description,
      isActive: isActive === "true", // Convert string to boolean
      photo, // This will be the data URL of the image
    });

    await newHierarchy.save();

    return new Response(
      JSON.stringify({ message: "Hierarchy entry created successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  await dbConnect();

  try {
    const hierarchies = await Hierarchy.find();
    return new Response(JSON.stringify(hierarchies), {
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
