import dbConnect from "../../../../../../dbConnect";
import Request from "../../../../../../models/request";
import authenticate from "../../../../../../auth";

export async function GET(req, { params }) {
  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { itemId } = params; // Item ID passed in the URL parameters

  try {
    // Fetch all requests that involve the specified item
    const requests = await Request.find({ item: itemId });

    if (!requests.length) {
      return new Response(
        JSON.stringify({ message: "No requests found for this item" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Extract and format logs from the requests
    const requestLogs = requests.flatMap((request) =>
      request.logs.map((log) => ({
        actionType: log.actionType,
        previousState: log.previousState,
        newState: log.newState,
        modifiedBy: log.modifiedBy,
        modifiedAt: log.modifiedAt,
        additionalInfo: log.additionalInfo,
        quantityChange: log.newState.quantity - log.previousState.quantity,
      }))
    );

    return new Response(JSON.stringify(requestLogs), {
      status: 200,
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
