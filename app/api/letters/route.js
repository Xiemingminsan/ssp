// pages/api/letters/route.js
import authenticate from "../../../auth";
import Letter from "../../../models/letter";
import dbConnect from "../../../dbConnect";

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { subject, sender, receiver, date, description, status } =
      await req.json(); // Destructure fields from the request body

    const newLetter = await Letter.create({
      subject,
      sender,
      receiver,
      date,
      description,
      status,
    });

    return new Response(JSON.stringify(newLetter), {
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

  try {
    const letters = await Letter.find({});
    return new Response(JSON.stringify(letters), {
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
