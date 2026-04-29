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

    const payments = await prisma.payment.findMany({
      where: {
        invoiceId: params.id,
        invoice: {
          companyId: session.user.companyId,
          deletedAt: null
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Payments GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Verify invoice belongs to company
    const invoice = await prisma.invoice.findFirst({
      where: { id: params.id, companyId: session.user.companyId, deletedAt: null },
      include: { payments: true }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    const payment = await prisma.$transaction(async (tx) => {
      // Record the payment
      const p = await tx.payment.create({
        data: {
          invoiceId: params.id,
          amount,
          date: new Date(body.date),
          method: body.method,
          referenceNumber: body.referenceNumber,
          notes: body.notes
        }
      });

      // Recalculate invoice status based on total paid
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + amount;
      
      let newStatus = invoice.status;
      if (totalPaid >= invoice.grandTotal) {
        newStatus = 'PAID';
      } else if (totalPaid > 0) {
        newStatus = 'PARTIALLY_PAID';
      }

      await tx.invoice.update({
        where: { id: params.id },
        data: { status: newStatus }
      });

      return p;
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error('Payments POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
