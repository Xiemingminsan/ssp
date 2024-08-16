import dbConnect from "../../../../../dbConnect";
import Request from "../../../../../models/request";
import authenticate from "../../../../../auth";
import Item from "../../../../../models/item"; // Import Item model for updating quantity

export async function PUT(req, { params }) {
  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = params;
  const { status } = await req.json();

  try {
    // Fetch the request and populate the item field
    const request = await Request.findById(id).populate("item");
    if (!request) {
      return new Response(JSON.stringify({ message: "Request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let previousQuantity = null;
    let newQuantity = null;

    if (status === "approved") {
      if (request.item) {
        // Fetch the item's current quantity
        const item = await Item.findById(request.item._id);
        previousQuantity = item.quantity;
        console.log("previousQuantity", previousQuantity);

        // Update the item's quantity based on request type
        if (request.requestType === "takeOut") {
          await Item.findByIdAndUpdate(request.item._id, {
            $inc: { quantity: -request.quantity },
          });
        } else if (request.requestType === "return") {
          await Item.findByIdAndUpdate(request.item._id, {
            $inc: { quantity: request.quantity },
          });
        }

        // Fetch the updated item's quantity
        const updatedItem = await Item.findById(request.item._id);
        console.log("updatedItem", updatedItem);
        newQuantity = updatedItem.quantity;
        console.log("newQuantity", newQuantity);

        // Calculate quantity change
        const quantityChange = newQuantity - previousQuantity;

        // Log the quantity change
        request.logs.push({
          actionType: "requestApproved",
          previousState: {
            status: request.status,
            quantity: previousQuantity,
          },
          newState: {
            status,
            quantity: newQuantity,
          },
          modifiedBy: authData.userId,
          modifiedAt: new Date(),
          additionalInfo: "Request status Approved",
          quantityChange,
        });
      }
    } else if (status === "denied") {
      // Log the request rejection
      request.logs.push({
        actionType: "requestDenied",
        previousState: {
          status: request.status,
          quantity: request.quantity,
        },
        newState: {
          status,
          quantity: request.quantity,
        },
        modifiedBy: authData.userId,
        modifiedAt: new Date(),
        additionalInfo: "Request status Denied",
      });
    }

    // Update request status and save
    request.status = status;
    await request.save();

    return new Response(JSON.stringify(request), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating request:", error.message);
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

export async function DELETE(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;

  try {
    // Find and delete the request
    const request = await Request.findByIdAndDelete(id);

    if (!request) {
      return new Response(JSON.stringify({ message: "Request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Request deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting request:", error.message);
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
