import dbConnect from "../../../../../../dbConnect";
import Request from "../../../../../../models/request";
import Item from "../../../../../../models/item";
import authenticate from "../../../../../../auth";

export async function GET(req, { params }) {
  const authData = await authenticate(req); // Authenticate the request

  // Authentication check
  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { itemId } = params;

  try {
    // Fetch the item with its logs
    const item = await Item.findById(itemId);
    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch all requests for the item
    const requests = await Request.find({ item: itemId });

    // Combine logs from both item and requests
    const combinedLogs = [
      ...item.logs.map((log) => ({
        ...log,
        source: "item",
      })),
      ...requests.flatMap((request) =>
        request.logs.map((log) => ({
          ...log,
          source: "request",
          requestId: request._id,
        }))
      ),
    ];

    // Sort logs by date
    combinedLogs.sort(
      (a, b) => new Date(a.modifiedAt) - new Date(b.modifiedAt)
    );

    return new Response(JSON.stringify({ item, logs: combinedLogs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching item history:", error.message);
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
