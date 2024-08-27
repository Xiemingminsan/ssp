// pages/api/events/route.js
import authenticate from "../../../../auth";
import dbConnect from "../../../../dbConnect";
import Event from "../../../../models/event";

// pages/api/events/[id]/route.js

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
    const event = await Event.findById(id);
    if (!event) {
      return new Response(
        JSON.stringify({ message: "Event entry not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(event), {
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
  const { person, action, reason, punishment, punishmentEndDate } =
    await req.json();

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        person,
        action,
        reason,
        punishment,
        punishmentEndDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return new Response(
        JSON.stringify({ message: "Event entry not found" }),
        { status: 404 }
      );
    }

    const log = {
      eventId: updatedEvent._id,
      actionType: "update",
      modifiedBy: authData.userId,
      modifiedAt: new Date(),
      additionalInfo: "Event entry updated",
    };
    await EventLog.create(log);

    return new Response(
      JSON.stringify({
        message: "Event entry updated successfully",
        event: updatedEvent,
      }),
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

// pages/api/events/[id]/route.js
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
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return new Response(
        JSON.stringify({ message: "Event entry not found" }),
        { status: 404 }
      );
    }

    const log = {
      eventId: event._id,
      actionType: "delete",
      modifiedBy: authData.userId,
      modifiedAt: new Date(),
      additionalInfo: "Event entry deleted",
    };
    await EventLog.create(log);

    return new Response(
      JSON.stringify({ message: "Event entry deleted successfully" }),
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
