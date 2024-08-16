// pages/api/conducts/route.js
import authenticate from "../../../../auth";
import ConductLog from "../../../../models/conductlog";
import dbConnect from "../../../../dbConnect";
import Conduct from "../../../../models/conduct";

// pages/api/conducts/[id]/route.js

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
    const conduct = await Conduct.findById(id);
    if (!conduct) {
      return new Response(
        JSON.stringify({ message: "Conduct entry not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(conduct), {
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
    const updatedConduct = await Conduct.findByIdAndUpdate(
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

    if (!updatedConduct) {
      return new Response(
        JSON.stringify({ message: "Conduct entry not found" }),
        { status: 404 }
      );
    }

    const log = {
      conductId: updatedConduct._id,
      actionType: "update",
      modifiedBy: authData.userId,
      modifiedAt: new Date(),
      additionalInfo: "Conduct entry updated",
    };
    await ConductLog.create(log);

    return new Response(
      JSON.stringify({
        message: "Conduct entry updated successfully",
        conduct: updatedConduct,
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

// pages/api/conducts/[id]/route.js
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
    const conduct = await Conduct.findByIdAndDelete(id);

    if (!conduct) {
      return new Response(
        JSON.stringify({ message: "Conduct entry not found" }),
        { status: 404 }
      );
    }

    const log = {
      conductId: conduct._id,
      actionType: "delete",
      modifiedBy: authData.userId,
      modifiedAt: new Date(),
      additionalInfo: "Conduct entry deleted",
    };
    await ConductLog.create(log);

    return new Response(
      JSON.stringify({ message: "Conduct entry deleted successfully" }),
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
