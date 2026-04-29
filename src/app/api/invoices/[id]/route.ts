import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
        deletedAt: null
      },
      include: {
        client: true,
        lineItems: {
          orderBy: { sortOrder: 'asc' }
        },
        payments: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Invoice GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Verify invoice belongs to company
    const existing = await prisma.invoice.findFirst({
      where: { id: params.id, companyId: session.user.companyId, deletedAt: null }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Since we are updating line items, it's easiest to delete them and recreate
    await prisma.$transaction(async (tx) => {
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: params.id }
      });

      await tx.invoice.update({
        where: { id: params.id },
        data: {
          clientId: body.clientId,
          status: body.status,
          issueDate: new Date(body.issueDate),
          dueDate: new Date(body.dueDate),
          currency: body.currency,
          subtotal: body.subtotal,
          discountType: body.discountType,
          discountValue: body.discountValue,
          discountAmount: body.discountAmount,
          taxTotal: body.taxTotal,
          grandTotal: body.grandTotal,
          notes: body.notes,
          terms: body.terms,
          paymentInstructions: body.paymentInstructions,
          lineItems: {
            create: body.lineItems.map((item: any, index: number) => ({
              productId: item.productId || null,
              description: item.description,
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              taxAmount: Number(item.taxAmount || 0),
              lineTotal: Number(item.lineTotal),
              sortOrder: index
            }))
          }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Invoice PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.updateMany({
      where: {
        id: params.id,
        companyId: session.user.companyId,
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    });

    if (invoice.count === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Invoice DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
