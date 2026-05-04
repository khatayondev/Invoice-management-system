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
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const search = searchParams.get('search');

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId: session.user.companyId,
        deletedAt: null,
        ...(status ? { status } : {}),
        ...(clientId ? { clientId } : {}),
        ...(search ? {
          OR: [
            { number: { contains: search } },
            { client: { name: { contains: search } } }
          ]
        } : {})
      },
      include: {
        client: true
      },
      orderBy: { issueDate: 'desc' }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Invoices GET error:', error);
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
    
    // Auto-generate invoice number
    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId }
    });
    
    const year = new Date(body.issueDate).getFullYear();
    const nextNumber = company?.invoiceStartNumber || 1;
    const number = `${company?.invoicePrefix || 'INV-'}${year}-${nextNumber.toString().padStart(4, '0')}`;
    
    // Increment the counter
    await prisma.company.update({
      where: { id: session.user.companyId },
      data: { invoiceStartNumber: { increment: 1 } }
    });

    // Create Invoice with Line Items
    const invoice = await prisma.invoice.create({
      data: {
        companyId: session.user.companyId,
        clientId: body.clientId,
        number,
        status: body.status || 'DRAFT',
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
        pdfTheme: body.pdfTheme || 'CLASSIC',
        themeColors: body.themeColors || null,
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

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error) {
    console.error('Invoices POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
