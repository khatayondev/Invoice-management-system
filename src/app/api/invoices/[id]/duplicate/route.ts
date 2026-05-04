import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const originalInvoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
        deletedAt: null
      },
      include: {
        lineItems: true
      }
    });

    if (!originalInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Auto-generate invoice number
    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId }
    });
    
    const year = new Date().getFullYear();
    const nextNumber = company?.invoiceStartNumber || 1;
    const number = `${company?.invoicePrefix || 'INV-'}${year}-${nextNumber.toString().padStart(4, '0')}`;
    
    // Increment the counter
    await prisma.company.update({
      where: { id: session.user.companyId },
      data: { invoiceStartNumber: { increment: 1 } }
    });

    // Create the duplicated invoice
    const duplicatedInvoice = await prisma.invoice.create({
      data: {
        companyId: session.user.companyId,
        clientId: originalInvoice.clientId,
        number,
        status: 'DRAFT',
        issueDate: new Date(),
        // Make due date 15 days from now by default
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        currency: originalInvoice.currency,
        subtotal: originalInvoice.subtotal,
        discountType: originalInvoice.discountType,
        discountValue: originalInvoice.discountValue,
        discountAmount: originalInvoice.discountAmount,
        taxTotal: originalInvoice.taxTotal,
        grandTotal: originalInvoice.grandTotal,
        notes: originalInvoice.notes,
        terms: originalInvoice.terms,
        paymentInstructions: originalInvoice.paymentInstructions,
        pdfTheme: originalInvoice.pdfTheme,
        themeColors: originalInvoice.themeColors,
        lineItems: {
          create: originalInvoice.lineItems.map(item => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxAmount: item.taxAmount,
            lineTotal: item.lineTotal,
            sortOrder: item.sortOrder
          }))
        }
      }
    });

    return NextResponse.json({ success: true, invoice: duplicatedInvoice });
  } catch (error) {
    console.error('Invoice Duplicate POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
