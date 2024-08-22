import dbConnect from "../../../dbConnect";
import Item from "../../../models/item";
import authenticate from "../../../auth";

export async function POST(req) {
  const authData = await authenticate(req); // Authenticate the request

  // Authentication check
  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  try {
    const { name, description, quantity } = await req.json();

    // Validate input
    if (!name || quantity === undefined) {
      return new Response(
        JSON.stringify({ message: "Name and quantity are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a new item
    const newItem = await Item.create({
      name,
      description,
      quantity,
      availableQuantity: quantity, // Set available quantity to the total quantity
      lastModifiedBy: authData.userId, // Set the user who added the item
    });

    return new Response(JSON.stringify(newItem), {
      status: 201,
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

export async function GET(req) {
  const authData = await authenticate(req); // Authenticate the request

  // Authentication check
  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  try {
    const items = await Item.find();
    // const items = await Item.find({ isArchived: false });
    return new Response(JSON.stringify(items), {
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
