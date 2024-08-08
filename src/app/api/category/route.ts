import { authOptions } from '@lib/auth/auth';
import { db } from '@lib/db/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import * as z from 'zod';

interface CategoryFilters {
  userId: number;
  id?: number;
}

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  userId: z.number().min(1, 'User is required'),
});

const updateCategorySchema = categorySchema.extend({
  id: z.number().min(1, 'ID is required'),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get('id'));
    const userId = Number(url.searchParams.get('userId'));

    const session = await getServerSession(authOptions);
    if (!session?.user.id || userId !== Number(session?.user.id)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    if (id > 0) {
      const existingCategory = await db.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        return NextResponse.json(
          { message: 'Category not found' },
          { status: 404 },
        );
      }
    }

    const filters: CategoryFilters = {
      userId: userId,
      ...(Number.isInteger(id) && id > 0 ? { id } : {}),
    };

    const categories = await db.category.findMany({
      where: filters,
      include: {
        Expenses: {
          select: {
            amount: true,
          },
        },
      },
    });

    const categoriesWithTotalAmount = categories
      .map(category => ({
        ...category,
        totalAmount: category.Expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0,
        ),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return NextResponse.json(
      { categories: categoriesWithTotalAmount },
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userId } = categorySchema.parse(body);

    const session = await getServerSession(authOptions);
    if (!session?.user.id || userId !== Number(session?.user.id)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const existingName = await db.category.findUnique({
      where: { name: name },
    });
    if (existingName) {
      return NextResponse.json(
        { name: null, message: 'Name already exists' },
        { status: 409 },
      );
    }

    const newCategory = await db.category.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(
      { expense: newCategory, message: 'Category created successfully' },
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
    const { id, name, userId } = updateCategorySchema.parse(body);

    const session = await getServerSession(authOptions);
    if (!session?.user.id || userId !== Number(session?.user.id)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const existingCategory = await db.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 },
      );
    }

    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(
      { expense: updatedCategory, message: 'Category updated successfully' },
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

    const existingCategory = await db.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 },
      );
    }

    const session = await getServerSession(authOptions);
    if (
      !session?.user.id ||
      existingCategory.userId !== Number(session?.user.id)
    ) {
      return NextResponse.json(
        { message: 'Unauthorized userId' },
        { status: 403 },
      );
    }

    await db.expense.deleteMany({
      where: { categoryId: id },
    });

    await db.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Category deleted successfully' },
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
