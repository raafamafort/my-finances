import { authOptions } from '@lib/auth/auth';
import { db } from '@lib/db/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import * as z from 'zod';

const incomeSchema = z.object({
    description: z.string().min(1, 'Description is required').max(50),
    amount: z.number().min(1, 'Amount is required'),
    color: z
        .string()
        .regex(
            /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
            'Color must be a valid hex color with 4 or 7 characters'
        ),
    userId: z.number().min(1, 'User is required'),
});

const updateIncomeSchema = incomeSchema.extend({
    id: z.number().min(1, 'ID is required'),
});

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = Number(url.searchParams.get('userId'));

        const session = await getServerSession(authOptions);
        if (!session?.user.id || userId !== Number(session?.user.id)) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (isNaN(userId) || userId <= 0) {
            return NextResponse.json(
                { message: 'Invalid userId' },
                { status: 400 }
            );
        }

        const incomes = await db.income.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                amount: 'desc',
            },
        });

        return NextResponse.json({ incomes }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Something went wrong!' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { description, amount, color, userId } = incomeSchema.parse(body);

        const session = await getServerSession(authOptions);
        if (!session?.user.id || userId !== Number(session?.user.id)) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const newIncome = await db.income.create({
            data: {
                description,
                amount,
                color,
                userId,
            },
        });

        return NextResponse.json(
            { income: newIncome, message: 'Income created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Something went wrong!' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, description, amount, color, userId } =
            updateIncomeSchema.parse(body);

        const session = await getServerSession(authOptions);
        if (!session?.user.id || userId !== Number(session?.user.id)) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const existingIncome = await db.income.findUnique({
            where: { id },
        });

        if (!existingIncome) {
            return NextResponse.json(
                { message: 'Income not found' },
                { status: 404 }
            );
        }

        const updatedIncome = await db.income.update({
            where: { id },
            data: {
                description,
                amount,
                color,
                userId,
            },
        });

        return NextResponse.json(
            { income: updatedIncome, message: 'Income updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Something went wrong!' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = Number(url.searchParams.get('id'));

        if (isNaN(id) || id <= 0) {
            return NextResponse.json(
                { message: 'Invalid ID' },
                { status: 400 }
            );
        }

        const existingIncome = await db.income.findUnique({
            where: { id },
        });

        if (!existingIncome) {
            return NextResponse.json(
                { message: 'Income not found' },
                { status: 404 }
            );
        }

        const session = await getServerSession(authOptions);
        if (
            !session?.user.id ||
            existingIncome.userId !== Number(session?.user.id)
        ) {
            return NextResponse.json(
                { message: 'Unauthorized userId' },
                { status: 401 }
            );
        }

        await db.income.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Income deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Something went wrong!' },
            { status: 500 }
        );
    }
}
