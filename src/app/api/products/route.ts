import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const products = await prisma.product.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
        OR: search ? [
          { name: { contains: search } },
          { description: { contains: search } }
        ] : undefined
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        companyId: session.user.companyId,
        name: body.name,
        description: body.description,
        defaultPrice: Number(body.defaultPrice) || 0,
        unit: body.unit || 'Unit',
      }
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
