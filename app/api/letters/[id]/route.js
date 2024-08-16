// pages/api/letters/[id]/route.js
import authenticate from "../../../../auth";
import Letter from "../../../../models/letter";
import Log from "../../../../models/log";
import dbConnect from "../../../../dbConnect";

export async function GET(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    // Find the letter
    const letter = await Letter.findById(id);
    if (!letter) {
      return new Response(JSON.stringify({ message: "Letter not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(letter), {
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
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;
  const {
    subject,
    sender,
    receiver,
    dateReceived,
    description,
    dateSent,
    status,
  } = await req.json();

  try {
    // Find the letter
    const existingLetter = await Letter.findById(id);
    if (!existingLetter) {
      return new Response(JSON.stringify({ message: "Letter not found" }), {
        status: 404,
      });
    }

    // Update the letter
    const updatedLetter = await Letter.findByIdAndUpdate(
      id,
      {
        subject,
        sender,
        receiver,
        dateReceived,
        description,
        dateSent,
        status,
      },
      { new: true, runValidators: true }
    );

    // Create a log entry
    const log = {
      letterId: updatedLetter.id,
      actionType: "update",
      modifiedBy: authData.userId,
      modifiedAt: new Date(),
    };
    await Log.create(log);

    return new Response(JSON.stringify(updatedLetter), {
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
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    // Find the letter
    const letter = await Letter.findById(id);
    if (!letter) {
      return new Response(JSON.stringify({ message: "Letter not found" }), {
        status: 404,
      });
    }

    // Delete the letter
    await Letter.findByIdAndDelete(id);

    // Create a log entry
    const log = {
      letterId: id,
      actionType: "delete",
      modifiedBy: authData.userId,
      modifiedAt: new Date(),
      additionalInfo: "Letter deleted",
    };
    await Log.create(log);

    return new Response(
      JSON.stringify({ message: "Letter deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
