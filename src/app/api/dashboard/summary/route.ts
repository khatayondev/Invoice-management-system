import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.user.companyId;

    // Get all invoices for the company
    const invoices = await prisma.invoice.findMany({
      where: { companyId, deletedAt: null },
      include: { payments: true }
    });

    const clientsCount = await prisma.client.count({
      where: { companyId, deletedAt: null }
    });

    let totalRevenue = 0;
    let outstanding = 0;
    let overdue = 0;
    
    const now = new Date();
    
    // Status breakdown
    const statuses: Record<string, number> = {
      DRAFT: 0, SENT: 0, VIEWED: 0, PARTIALLY_PAID: 0, PAID: 0, OVERDUE: 0, CANCELLED: 0
    };

    invoices.forEach(inv => {
      statuses[inv.status] = (statuses[inv.status] || 0) + 1;
      
      const paid = inv.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = Math.max(0, inv.grandTotal - paid);

      if (inv.status !== 'CANCELLED' && inv.status !== 'DRAFT') {
        if (inv.status === 'PAID') {
          totalRevenue += inv.grandTotal;
        } else {
          totalRevenue += paid; // partial payments
        }
        
        if (balance > 0) {
          outstanding += balance;
          if (new Date(inv.dueDate) < now) {
            overdue += balance;
            // Update status if it's overdue but not marked as such
            if (inv.status !== 'OVERDUE') {
              statuses.OVERDUE++;
              statuses[inv.status]--;
            }
          }
        }
      }
    });

    // Recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      where: { companyId, deletedAt: null },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Recent payments
    const recentPayments = await prisma.payment.findMany({
      where: { invoice: { companyId } },
      include: { invoice: { include: { client: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Merge into activity feed
    const activities = [
      ...recentInvoices.map(inv => ({
        id: `inv-${inv.id}`,
        type: 'INVOICE_CREATED',
        date: inv.createdAt,
        title: `New Invoice ${inv.number}`,
        description: `Created for ${inv.client.name}`
      })),
      ...recentPayments.map(pay => ({
        id: `pay-${pay.id}`,
        type: 'PAYMENT_RECEIVED',
        date: pay.createdAt,
        title: `Payment of $${pay.amount}`,
        description: `Received for Invoice ${pay.invoice.number} (${pay.invoice.client.name})`
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    return NextResponse.json({
      summary: {
        totalRevenue,
        outstanding,
        overdue,
        invoicesCount: invoices.length,
        clientsCount
      },
      statuses,
      recentInvoices,
      recentActivity: activities
    });
  } catch (error) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
