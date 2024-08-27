// pages/api/events/route.js
import authenticate from "../../../auth";
import Event from "../../../models/event";
import dbConnect from "../../../dbConnect";

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { date, reason, place, phone, booker } = await req.json();

    const newEvent = await Event.create({
      date,
      reason,
      place,
      phone,
      booker,
    });

    return new Response(JSON.stringify(newEvent), {
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
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");

  try {
    let events;

    if (dateParam) {
      // Parse the date and define the range for the entire day
      const date = new Date(dateParam);
      const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

      events = await Event.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      });
    } else {
      // Fetch all events if no date parameter is provided
      events = await Event.find({});
    }

    return new Response(JSON.stringify(events), {
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
