import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/passwords';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: { companyId: session.user.companyId, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Team GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Generate random password if not provided
    const rawPassword = body.password || Math.random().toString(36).slice(-10);
    const hashedPassword = await hashPassword(rawPassword);

    const newUser = await prisma.user.create({
      data: {
        companyId: session.user.companyId,
        email: body.email,
        name: body.name,
        role: body.role || 'VIEWER',
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: newUser, 
      tempPassword: rawPassword 
    }, { status: 201 });
  } catch (error) {
    console.error('Team POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId || userId === session.user.id) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId, companyId: session.user.companyId },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Team DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
