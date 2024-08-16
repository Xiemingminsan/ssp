import dbConnect from "../../../../../../../dbConnect";
import Request from "../../../../../../../models/request";
import Item from "../../../../../../../models/item";
import authenticate from "../../../../../../../auth";

export async function GET(req, { params }) {
  await dbConnect();

  const { itemId } = params;
  const authData = await authenticate(req);

  if (!authData) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Fetch the item
    const item = await Item.findById(itemId);
    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch all requests for the item that were made by the authenticated user
    const requests = await Request.find({
      item: itemId,
      user: authData.userId,
    }).populate("item");

    // Combine logs from requests
    const userRequestLogs = requests.flatMap((request) =>
      request.logs.map((log) => ({
        ...log,
        source: "request",
        requestId: request._id,
      }))
    );

    // Sort logs by date
    userRequestLogs.sort(
      (a, b) => new Date(a.modifiedAt) - new Date(b.modifiedAt)
    );

    return new Response(JSON.stringify({ item, logs: userRequestLogs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user request history:", error.message);
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
