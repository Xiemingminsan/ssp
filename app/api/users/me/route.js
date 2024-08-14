// me/route.js
import dbConnect from '../../../../dbConnect';
import authenticate from '../../../../auth'; // Import the authenticate function
import User from '../../../../models/user'; // Import the User model

export async function GET(req) {
  await dbConnect();

  const authData = await authenticate(req); // Authenticate and get the userId and role

  if (!authData) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const userProfile = await User.findById(authData.userId).select('-PasswordHash'); // Fetch full user profile
    
    if (!userProfile) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(userProfile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
