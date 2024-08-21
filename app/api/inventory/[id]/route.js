import dbConnect from "../../../../dbConnect";
import Item from "../../../../models/item";
import authenticate from "../../../../auth";

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

  const { id } = params;

  try {
    const item = await Item.findById(id);

    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
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
  const { name, description, quantity } = await req.json();

  try {
    const item = await Item.findById(id);

    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create a log entry for the update
    item.logs.push({
      actionType: "update",
      previousState: {
        name: item.name,
        description: item.description,
        quantity: item.quantity,
      },
      newState: {
        name: name || item.name,
        description: description || item.description,
        quantity: quantity !== undefined ? quantity : item.quantity,
      },
      modifiedBy: authData.userId,
      additionalInfo: "Updated item details",
    });

    // Update item details
    item.name = name || item.name;
    item.description = description || item.description;
    item.quantity = quantity !== undefined ? quantity : item.quantity;
    item.lastModifiedBy = authData.userId;
    item.lastModifiedAt = new Date();

    await item.save();

    return new Response(JSON.stringify(item), {
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

export async function DELETE(req, { params }) {
  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = params;

  try {
    const item = await Item.findById(id);

    if (!item) {
      return new Response(JSON.stringify({ message: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    item.isArchived = true; // Mark the item as archived
    console.log(item.isArchived);
    console.log("item", item);
    // Create a log entry for the deletion
    item.logs.push({
      actionType: "delete",
      previousState: {
        name: item.name,
        description: item.description,
        quantity: item.quantity,
      },
      modifiedBy: authData.userId,
      additionalInfo: "Deleted item from inventory",
    });

    await item.save();

    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
