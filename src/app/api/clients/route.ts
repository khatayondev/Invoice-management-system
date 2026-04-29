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

    const clients = await prisma.client.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
        OR: search ? [
          { name: { contains: search } },
          { email: { contains: search } },
          { clientCompany: { contains: search } }
        ] : undefined
      },
      include: {
        _count: {
          select: { invoices: { where: { deletedAt: null } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Clients GET error:', error);
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

    const client = await prisma.client.create({
      data: {
        companyId: session.user.companyId,
        name: body.name,
        clientCompany: body.clientCompany,
        email: body.email,
        phone: body.phone,
        billingAddress: body.billingAddress,
        taxId: body.taxId,
        currency: body.currency,
        paymentTerms: body.paymentTerms || 'Net 15',
      }
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error) {
    console.error('Clients POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
