// pages/api/conducts/route.js
import authenticate from "../../../auth";
import ConductLog from "../../../models/conductlog";
import dbConnect from "../../../dbConnect";
import Conduct from "../../../models/conduct";

export async function POST(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { person, action, reason, punishment, punishmentEndDate } =
    await req.json();

  try {
    const newConduct = new Conduct({
      person,
      action,
      reason,
      punishment,
      punishmentEndDate,
    });

    await newConduct.save();

    const log = {
      conductId: newConduct._id,
      actionType: "create",
      modifiedBy: authData.userId,
      modifiedAt: new Date(),
      additionalInfo: "Conduct entry created",
    };
    await ConductLog.create(log);

    return new Response(JSON.stringify(newConduct), {
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
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(req) {
  await dbConnect();

  const authData = await authenticate(req);

  if (!authData || authData.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const conducts = await Conduct.find();

    return new Response(JSON.stringify(conducts), {
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
