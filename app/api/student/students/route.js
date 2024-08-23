import dbConnect from "../../../../dbConnect";
import Student from "../../../../models/student";
import Batch from "../../../../models/batch";
import authenticate from "../../../../auth";
<<<<<<< Updated upstream
=======
import fs from "fs";
import path from "path";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    courses,
    attendance,
=======
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
>>>>>>> Stashed changes
  } = await req.json();

  // Handle the profile picture upload
  let profilePicturePath = null;
  const profilepicture = req.files?.profilepicture;
  console.log("profilePicturePath" + " " + profilepicture);
  if (profilepicture) {
    console.log("profilePicture is found");
    const uploadDir = path.join(process.cwd(), "public", "Profile_Img");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${firstname}-${lastname}-${Date.now()}.${profilepicture.name
      .split(".")
      .pop()}`;
    const filePath = path.join(uploadDir, fileName);
    await profilepicture.mv(filePath);
    profilePicturePath = `../../../public/Profile_Img/${fileName}`;
  }

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
      profilepicture: profilePicturePath,
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
<<<<<<< Updated upstream
      courses,
      attendance,
=======
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
>>>>>>> Stashed changes
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
