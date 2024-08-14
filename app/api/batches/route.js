import dbConnect from '../../../dbConnect';
import Batch from '../../../models/batch';

export async function POST(req) {
  await dbConnect();

  const { name, courses } = await req.json();

  try {
    const existingBatch = await Batch.findOne({ name });
    if (existingBatch) {
      return new Response(JSON.stringify({ message: 'Batch name already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newBatch = new Batch({ name, courses});

    await newBatch.save();

    return new Response(JSON.stringify({ message: 'Batch created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    const batches = await Batch.find();
    return new Response(JSON.stringify(batches), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
