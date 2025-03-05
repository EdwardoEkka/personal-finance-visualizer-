import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongod";
import Transaction from "@/app/models/transactions";

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find({});
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Database connection error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.amount || !body.date || !body.description || !body.category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const transaction = new Transaction(body);
    await transaction.save();

    return NextResponse.json({ message: "Transaction added", id: transaction._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error adding transaction" }, { status: 500 });
  }
}



export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
    }

    await Transaction.findByIdAndUpdate(id, updateData);

    return NextResponse.json({ message: "Transaction updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error updating transaction" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted successfully", id }, { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}