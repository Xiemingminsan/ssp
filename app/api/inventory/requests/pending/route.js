import dbConnect from "../../../../../dbConnect";
import Request from "../../../../../models/request";
import authenticate from "../../../../../auth";
export async function GET(req) {
  const authData = await authenticate(req); // Authenticate and get the userId and role

  // Authentication check
  if (!authData || !["admin", "manager"].includes(authData.role)) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  try {
    // Fetch all requests with status 'pending'
    const pendingRequests = await Request.find({ status: "pending" })
      .populate("user", "username") // Populate user with the 'username' field
      .populate("item", "name") // Populate item with the 'name' field
      .populate({
        path: "item",
        select: "name quantity availableQuantity loanedQuantity loanedItems", // Explicitly select the fields you need
      });

    return new Response(JSON.stringify(pendingRequests), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message); // Log the error
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
