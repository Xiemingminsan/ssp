import dbConnect from '../../../../dbConnect';
import Course from '../../../../models/course';
import authenticate from '../../../../auth'; // Assuming you have authentication logic

export async function GET(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);
  if (!authData) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = params;
  console.log(id);

  try {
    const courses = await Course.findById(id);
    console.log(courses.batchid);
    if (courses.length === 0) {
      return new Response(JSON.stringify({ message: 'No courses found for this batch' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(courses), {
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
export async function DELETE(req, { params }) {
  const authData = await authenticate(req); // Authenticate the request

  if (!authData || authData.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await dbConnect();

  const { id } = params;
console.log(id);
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return new Response(JSON.stringify({ message: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Course deleted successfully' }), {
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