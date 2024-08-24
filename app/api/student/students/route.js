import dbConnect from "../../../../dbConnect";
import Student from "../../../../models/student";
import Batch from "../../../../models/batch";
import authenticate from "../../../../auth";

import fs from "fs";
import path from "path";

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
    middlename,
    lastname,
    birthdate,
    batch,
    batchname,
    mothername,
    profilepicture,
    gender,
    christianname,
    previoussundayschool,
    previoussundayschoolstart,
    previoussundayschoolend,
    highereducation,
    institutionname,
    highereducationstart,
    highereducationend,
    graduatedin,
    registrationday,
    city,
    subcity,
    kebele,
    woreda,
    phone,
    postalnumber,
    email,
    employmenttype,
    companyname,
    companyaddress,
    educationlevel,
    maritalstatus,
    livewith,
    talentsinterests,
    preferredworkarea,
    emergencycontactname,
    emergencycontactphone,
    courses, // Array of course IDs
    attendance, // Array of attendance records
  } = await req.json();
  try {
    const existingStudent = await Student.findOne({ email });
    const existingStudentBirthdate = await Student.findOne({ birthdate });

    if (existingStudent || existingStudentBirthdate) {
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
      middlename,
      lastname,
      profilepicture,
      birthdate,
      batch,
      batchname,
      mothername,
      gender,
      christianname,
      previoussundayschool,
      previoussundayschoolstart,
      previoussundayschoolend,
      highereducation,
      institutionname,
      highereducationstart,
      highereducationend,
      graduatedin,
      registrationday,
      city,
      subcity,
      kebele,
      woreda,
      phone,
      postalnumber,
      email,
      employmenttype,
      companyname,
      companyaddress,
      educationlevel,
      maritalstatus,
      livewith,
      talentsinterests,
      preferredworkarea,
      emergencycontactname,
      emergencycontactphone,
      courses, // Array of course IDs
      attendance, // Array of attendance records
    });

    console.log(newStudent);

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

// The GET route remains the same
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
    const students = await Student.find();

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
