// pages/api/hierarchy/[id]/route.js
import authenticate from "../../../../auth";
import Management from "../../../../models/management"; // Assuming the model is named 'management'
import dbConnect from "../../../../dbConnect";
import { NextResponse } from "next/server";
import path from "path";
import mongoose from "mongoose";

import { writeFile, unlink } from "fs/promises";
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
    const hierarchy = await Management.findById(id);
    if (!hierarchy) {
      return new Response(JSON.stringify({ message: "Management not found" }), {
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
  console.log("PUT request received");

  try {
    await dbConnect();
    console.log("Database connected");

    const authData = await authenticate(req);
    console.log("Auth data:", authData);

    if (!authData || authData.role !== "admin") {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    console.log("Received ID from params:", id);

    if (!id) {
      console.log("ID is missing from URL parameters");
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    console.log("Received form data keys:", Array.from(formData.keys()));

    // Fetch existing record
    const existingManagement = await Management.findById(id);
    if (!existingManagement) {
      console.log("Management not found for ID:", id);
      return NextResponse.json(
        { message: "Management not found" },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData = {};
    const fieldsToUpdate = ["name", "role", "phone", "description", "isActive"];

    fieldsToUpdate.forEach((field) => {
      const value = formData.get(field);
      if (value !== undefined && value !== null) {
        updateData[field] = field === "isActive" ? value === "true" : value;
      }
    });

    console.log("Update data prepared:", updateData);

    // Handle photo update
    const photoFile = formData.get("photo");
    if (photoFile && photoFile instanceof Blob) {
      try {
        const buffer = Buffer.from(await photoFile.arrayBuffer());
        const filename = Date.now() + "-" + photoFile.name.replace(/\s/g, "_");
        const filepath = path.join(
          process.cwd(),
          "public",
          "Profile_Img",
          filename
        );
        await writeFile(filepath, buffer);
        updateData.photo = filename;
        console.log("Photo updated successfully:", filename);

        // Delete the old photo if it exists
        if (existingManagement.photo) {
          const oldFilePath = path.join(
            process.cwd(),
            "public",
            "Profile_Img",
            existingManagement.photo
          );
          try {
            await unlink(oldFilePath);
            console.log("Old photo deleted:", existingManagement.photo);
          } catch (deleteError) {
            console.error("Error deleting old photo:", deleteError);
          }
        }
      } catch (photoError) {
        console.error("Error processing photo:", photoError);
        return NextResponse.json(
          { message: "Error processing photo", error: photoError.message },
          { status: 500 }
        );
      }
    }

    // Update record
    const updatedManagement = await Management.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    console.log("Management updated successfully:", updatedManagement);
    return NextResponse.json(
      {
        message: "Management entry updated successfully",
        data: updatedManagement,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/hierarchy/[id]:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
        stack: error.stack,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  console.log("delete request arrived" + req.params);
  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ message: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Attempting to delete record with ID:", id);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ID format:", id);
      return new Response(JSON.stringify({ message: "Invalid ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedManagement = await Management.findByIdAndDelete(id);
    console.log("Deletion operation result:", deletedManagement);

    if (!deletedManagement) {
      console.log("No record found for ID:", id);
      return new Response(JSON.stringify({ message: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Record deleted successfully:", deletedManagement);
    return new Response(
      JSON.stringify({ message: "Record deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error during DELETE operation:", error);
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
