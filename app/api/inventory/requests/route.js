import dbConnect from "../../../../dbConnect";
import Request from "../../../../models/request";
import authenticate from "../../../../auth";
import Item from "../../../../models/item";

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
    const { itemId, quantity, requestType, dueDate } = await req.json();
    console.log("Due date:", dueDate);

    if (!itemId || !quantity || !requestType) {
      return new Response(
        JSON.stringify({
          message: "Item ID, quantity, and request type are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if the item exists and if there is enough available quantity for takeOut requests
    const item = await Item.findById(itemId);
    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (requestType === "takeOut" && quantity > item.availableQuantity) {
      return new Response(
        JSON.stringify({ message: "Not enough items available for takeout" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create the request
    const newRequest = await Request.create({
      item: itemId,
      user: authData.userId,
      quantity,
      requestType,
      dueDate,
    });

    console.log("New request:", newRequest.dueDate);
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
