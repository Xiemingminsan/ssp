import bcrypt from 'bcrypt';
import dbConnect from '../../../../dbConnect';
import User from '../../../../models/user';

export async function POST(req) {
  await dbConnect();

  const { username, password, email, role } = await req.json();

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'username already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return new Response(JSON.stringify({ message: 'email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const passwordhash = await bcrypt.hash(password, 10);

    // Set the user role
    const userRole = role || 'user';  // Default role to 'user' if not provided

    const newUser = new User({
      username,
      passwordhash,
      email,
      role: userRole,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
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
