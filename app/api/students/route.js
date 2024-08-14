import dbConnect from '../../../dbConnect';
import Student from '../../../models/student';
import authenticate from '../../../auth'; // Import the authenticate function
import Batch from '../../../models/batch';
import Course from '../../../models/course';


export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req); // Authenticate the request

  if (!authData || authData.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const {
    firstname,
    lastname,
    batch,
    profilepicture,
    birthdate,
    email,
    courses, // Array of course IDs
    attendance, // Array of attendance records
  } = await req.json();

  try {
    // Check if the email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newStudent = new Student({
      firstname,
      lastname,
      batch,
      profilepicture,
      birthdate,
      email,
      courses, // Store the array of course IDs
      attendance, // Store the array of attendance records
    });

    await newStudent.save();

    return new Response(JSON.stringify({ message: 'Student registered successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  await dbConnect();

  const authData = await authenticate(req); // Authenticate the request

  if (!authData || authData.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const students = await Student.find()
      .populate('batch')
      .populate('courses')
      .populate('attendance.course');

    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}