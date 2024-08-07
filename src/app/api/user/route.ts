import { db } from '@lib/db/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import * as z from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  lastName: z.string().min(1, 'Last Name is required').max(100),
  email: z.string().min(1, 'Email is required').email(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, lastName } = userSchema.parse(body);

    const existingEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { user: null, message: 'Email already exists' },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        lastName,
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: 'User created successfully' },
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
