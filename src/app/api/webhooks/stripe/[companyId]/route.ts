import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company || !company.stripeSecretKey || !company.stripeWebhookSecret) {
      return new NextResponse('Company Stripe config not found', { status: 400 });
    }

    const stripe = new Stripe(company.stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    const body = await request.text();
    const signature = request.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, company.stripeWebhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const invoiceId = session.metadata?.invoiceId;
      if (!invoiceId) {
        throw new Error('No invoiceId in metadata');
      }

      // Record the payment
      const amountPaid = (session.amount_total || 0) / 100;
      
      await prisma.$transaction(async (tx) => {
        // Create payment record
        await tx.payment.create({
          data: {
            invoiceId,
            amount: amountPaid,
            date: new Date(),
            method: 'CARD',
            referenceNumber: session.payment_intent as string || session.id,
            notes: 'Paid via Stripe Checkout'
          }
        });

        // Calculate new balance to update invoice status
        const invoice = await tx.invoice.findUnique({
          where: { id: invoiceId },
          include: { payments: true }
        });

        if (invoice) {
          const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0) + amountPaid;
          const status = totalPaid >= invoice.grandTotal ? 'PAID' : 'PARTIALLY_PAID';
          
          await tx.invoice.update({
            where: { id: invoiceId },
            data: { status }
          });
        }
      });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
