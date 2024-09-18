import dbConnect from "../../../dbConnect";
import Hierarchy from "../../../models/management";
import authenticate from "../../../auth";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import bcrypt from "bcrypt"; // Added for hashing passwords
export async function POST(req) {
  console.log("POST request received");

  try {
    await dbConnect();
    console.log("Database connected");

    const authData = await authenticate(req);
    console.log("Auth data:", authData);

    const formData = await req.formData();
    const name = formData.get("name");
    const role = formData.get("role");
    const phone = formData.get("phone");
    const description = formData.get("description");
    const isActive = formData.get("isActive") === "true";
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(
      "Extracted values - name:",
      name,
      "role:",
      role,
      "email:",
      email,
      "password:",
      password
    );

    let photoPath = undefined;
    const photoFile = formData.get("photo");
    if (photoFile && photoFile instanceof Blob) {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const filename = Date.now() + "-" + photoFile.name.replace(/\s/g, "_");
      const filepath = path.join(
        process.cwd(),
        "public",
        "Profile_Img",
        filename
      );
      await writeFile(filepath, buffer);
      photoPath = filename;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newHierarchy = new Hierarchy({
      name,
      role,
      phone,
      description,
      isActive,
      photo: photoPath,
      email: email || "default@example.com",
      password: hashedPassword || "defaultPassword",
    });

    console.log("New hierarchy object created:", {
      name: newHierarchy.name,
      role: newHierarchy.role,
      phone: newHierarchy.phone,
      description: newHierarchy.description,
      isActive: newHierarchy.isActive,
      photo: newHierarchy.photo,
      email: newHierarchy.email,
      password: newHierarchy.password,
    });

    const savedHierarchy = await newHierarchy.save();
    console.log("Hierarchy saved to database:", savedHierarchy._id);

    return NextResponse.json(
      { message: "Hierarchy entry created successfully", data: savedHierarchy },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/hierarchy:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("GET request received");

  try {
    await dbConnect();
    console.log("Database connected");

    const hierarchies = await Hierarchy.find();
    console.log("Fetched hierarchies:", hierarchies.length);

    return NextResponse.json(hierarchies);
  } catch (error) {
    console.error("Error in GET /api/hierarchy:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
