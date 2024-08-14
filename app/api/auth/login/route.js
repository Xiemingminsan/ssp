import jwt from 'jsonwebtoken';
import dbConnect  from '../../../../dbConnect';
import User from '../../../../models/user';
import bcrypt from 'bcrypt';

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();

  // Find the user in the database
  const user = await User.findOne({ username });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.passwordhash);

  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '6h' }
  );

  console.log('Token generated:', token);

  return new Response(JSON.stringify({ token }), { status: 200 });
}
