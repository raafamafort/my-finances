import { db } from '@lib/db/db';
import { NextResponse } from 'next/server';
import * as z from 'zod';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required').max(50),
  amount: z.number().min(1, 'Amount is required'),
  color: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
      'Color must be a valid hex color with 4 or 7 characters',
    ),
  userId: z.number().min(1, 'User is required'),
});

const updateExpenseSchema = expenseSchema.extend({
  id: z.number().min(1, 'ID is required'),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get('userId'));

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    const expenses = await db.expense.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        amount: 'desc',
      },
    });

    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, amount, color, userId } = expenseSchema.parse(body);

    const newExpense = await db.expense.create({
      data: {
        description,
        amount,
        color,
        userId,
      },
    });

    return NextResponse.json(
      { expense: newExpense, message: 'Expense created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, description, amount, color, userId } =
      updateExpenseSchema.parse(body);

    const existingExpense = await db.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 },
      );
    }

    const updatedExpense = await db.expense.update({
      where: { id },
      data: {
        description,
        amount,
        color,
        userId,
      },
    });

    return NextResponse.json(
      { expense: updatedExpense, message: 'Expense updated successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get('id'));

    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const existingExpense = await db.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 },
      );
    }

    await db.expense.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Expense deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
