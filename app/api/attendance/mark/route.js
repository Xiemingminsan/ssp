import dbConnect from '../../../../dbConnect';
import Student from '../../../../models/student';
import authenticate from '../../../../auth';

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { batchId, courseId, attendanceRecords } = await req.json();

  try {
    // Ensure attendanceRecords is an array
    if (!Array.isArray(attendanceRecords)) {
      throw new Error('attendanceRecords must be an array');
    }

    // Process each attendance record
    for (const record of attendanceRecords) {
      const { studentId, date, status } = record;

      // Find the student
      const student = await Student.findById(studentId);
      if (!student) {
        throw new Error(`Student with ID ${studentId} not found`);
      }

      // Add the attendance record
      student.attendance.push({
        course: courseId,
        date: new Date(date),
        status
      });

      // Save the updated student document
      await student.save();
    }

    return new Response(JSON.stringify({ message: 'Attendance marked successfully' }), {
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
