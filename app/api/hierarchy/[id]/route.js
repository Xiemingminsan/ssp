// pages/api/hierarchy/[id]/route.js
import authenticate from "../../../../auth";
import Hierarchy from "../../../../models/management"; // Assuming the model is named 'management'
import dbConnect from "../../../../dbConnect";

export async function GET(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    // Find the hierarchy by ID
    const hierarchy = await Hierarchy.findById(id);
    if (!hierarchy) {
      return new Response(JSON.stringify({ message: "Hierarchy not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(hierarchy), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;
  const { name, role, phone, photo, description, isActive } = await req.json();

  try {
    // Find the hierarchy by ID
    const existingHierarchy = await Hierarchy.findById(id);
    if (!existingHierarchy) {
      return new Response(JSON.stringify({ message: "Hierarchy not found" }), {
        status: 404,
      });
    }

    // Update the hierarchy
    const updatedHierarchy = await Hierarchy.findByIdAndUpdate(
      id,
      {
        name,
        role,
        phone,
        photo,
        description,
        isActive,
      },
      { new: true, runValidators: true }
    );

    return new Response(JSON.stringify(updatedHierarchy), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    // Find the hierarchy by ID
    const hierarchy = await Hierarchy.findById(id);
    if (!hierarchy) {
      return new Response(JSON.stringify({ message: "Hierarchy not found" }), {
        status: 404,
      });
    }

    // Delete the hierarchy
    await Hierarchy.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: "Hierarchy deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
