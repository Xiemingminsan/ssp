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
    const request = await Request.findById(id).populate("item user");
    if (!request) {
      return new Response(JSON.stringify({ message: "Request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    let previousAvailableQuantity = null;
    let newAvailableQuantity = null;

    if (status === "approved") {
      if (request.item) {
        const item = await Item.findById(request.item._id);
        previousAvailableQuantity = item.availableQuantity;

        if (request.requestType === "takeOut") {
          if (request.quantity > item.availableQuantity) {
            return new Response(
              JSON.stringify({ message: "Not enough items available" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Update availableQuantity and loanedQuantity
          item.availableQuantity -= request.quantity;
          item.loanedQuantity += request.quantity;

          // Add this loan to the loanedItems array
          item.loanedItems.push({
            user: request.user._id,
            quantity: request.quantity,
            dueDate: request.dueDate || null, // Set due date if applicable
          });
        } else if (request.requestType === "return") {
          item.availableQuantity += request.quantity;
          item.loanedQuantity -= request.quantity;

          // Handle the return by adjusting or removing from loanedItems
          let remainingQuantity = request.quantity;

          // Iterate over the loanedItems array
          for (let i = item.loanedItems.length - 1; i >= 0; i--) {
            let loan = item.loanedItems[i];

            if (loan.user.toString() === request.user._id.toString()) {
              if (remainingQuantity >= loan.quantity) {
                // If the returned quantity is greater than or equal to this loan entry, remove it
                remainingQuantity -= loan.quantity;
                item.loanedItems.splice(i, 1); // Remove this entry from loanedItems
              } else {
                // If only part of the loan is returned, adjust the quantity
                loan.quantity -= remainingQuantity;
                remainingQuantity = 0;
                break; // All returned items accounted for, no need to continue
              }
            }

            if (remainingQuantity <= 0) break; // Stop if all returned items have been accounted for
          }
        }

        await item.save();

        // Fetch the updated available quantity
        newAvailableQuantity = item.availableQuantity;

        // Log the quantity change
        request.logs.push({
          actionType: "requestApproved",
          previousState: {
            status: request.status,
            quantity: previousAvailableQuantity,
          },
          newState: {
            status,
            quantity: newAvailableQuantity,
          },
          modifiedBy: authData.userId,
          modifiedAt: new Date(),
          additionalInfo: "Request status Approved",
          quantityChange: newAvailableQuantity - previousAvailableQuantity,
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
