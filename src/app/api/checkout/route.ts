import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        company: true,
        client: true,
        lineItems: true,
        payments: true
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.company.stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe is not configured for this company' }, { status: 400 });
    }

    const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);
    const balanceDue = Math.max(0, invoice.grandTotal - totalPaid);

    if (balanceDue <= 0) {
      return NextResponse.json({ error: 'Invoice is already paid' }, { status: 400 });
    }

    // Initialize Stripe with the company's secret key
    const stripe = new Stripe(invoice.company.stripeSecretKey, {
      apiVersion: '2023-10-16' as any, // Using compatible API version
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: `Invoice ${invoice.number}`,
              description: `Payment for ${invoice.company.name}`,
            },
            unit_amount: Math.round(balanceDue * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/view/${invoice.token}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/view/${invoice.token}?canceled=true`,
      client_reference_id: invoice.id,
      metadata: {
        invoiceId: invoice.id,
        companyId: invoice.companyId,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
