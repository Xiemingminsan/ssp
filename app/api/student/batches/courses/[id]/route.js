import dbConnect from "../../../../../../dbConnect";
import Batch from "../../../../../../models/batch";
import authenticate from "../../../../../../auth";

export async function GET(req, { params }) {
  const authData = await authenticate(req); // Authenticate the request

  await dbConnect();

  const { id } = params;
  console.log("Courses", id);

  try {
    const batch = await Batch.findById(id).populate("courses");
    console.log(batch);

    if (!batch) {
      return new Response(JSON.stringify({ message: "Batch not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(batch), {
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
