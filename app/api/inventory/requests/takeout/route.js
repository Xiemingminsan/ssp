import dbConnect from "../../../../../dbConnect";
import Request from "../../../../../models/request";
import authenticate from "../../../../../auth";

export async function POST(req) {
  const authData = await authenticate(req);

  // Authentication check
  if (!authData || !["admin", "manager", "user"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  try {
    const { itemId, quantity } = await req.json();

    if (!itemId || !quantity) {
      return new Response(
        JSON.stringify({ message: "Item ID and quantity are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("itemId", authData.userId);
    const newRequest = await Request.create({
      item: itemId,
      user: authData.userId,
      quantity,
      requestType: "takeOut",
    });

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
