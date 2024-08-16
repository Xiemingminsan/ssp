import dbConnect from "../../../../../dbConnect";
import Request from "../../../../../models/request";
import authenticate from "../../../../../auth";

export async function POST(req) {
  const authData = await authenticate(req);

  if (!authData || !["admin", "manager", "user"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { itemId, quantity } = await req.json();

  try {
    // Create a new request
    const newRequest = new Request({
      item: itemId,
      user: authData.userId,
      quantity,
      requestType: "return",
    });

    await newRequest.save();

    return new Response(JSON.stringify(newRequest), {
      status: 201,
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
