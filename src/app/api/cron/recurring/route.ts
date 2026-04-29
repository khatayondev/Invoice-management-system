import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addWeeks, addMonths, addQuarters, addYears } from 'date-fns';

export async function GET(request: Request) {
  // 1. Verify cron secret (if deployed on Vercel or using cron-job.org)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const today = new Date();
    
    // Find all schedules that need to run
    const schedules = await prisma.recurringSchedule.findMany({
      where: {
        isActive: true,
        nextRunDate: { lte: today }
      },
      include: {
        invoice: {
          include: { lineItems: true, company: true }
        }
      }
    });

    let generatedCount = 0;

    for (const schedule of schedules) {
      const template = schedule.invoice;
      
      // Auto-generate next invoice number
      const company = template.company;
      const year = today.getFullYear();
      const nextNumber = company.invoiceStartNumber;
      const newNumber = `${company.invoicePrefix}${year}-${nextNumber.toString().padStart(4, '0')}`;
      
      await prisma.$transaction(async (tx) => {
        // Increment counter
        await tx.company.update({
          where: { id: company.id },
          data: { invoiceStartNumber: { increment: 1 } }
        });

        // Calculate due date based on previous offset
        const daysToDue = Math.floor((template.dueDate.getTime() - template.issueDate.getTime()) / (1000 * 60 * 60 * 24));
        const newDueDate = new Date(today);
        newDueDate.setDate(newDueDate.getDate() + daysToDue);

        // Create the new invoice
        const newInvoice = await tx.invoice.create({
          data: {
            companyId: template.companyId,
            clientId: template.clientId,
            number: newNumber,
            status: 'DRAFT',
            issueDate: today,
            dueDate: newDueDate,
            currency: template.currency,
            subtotal: template.subtotal,
            discountType: template.discountType,
            discountValue: template.discountValue,
            discountAmount: template.discountAmount,
            taxTotal: template.taxTotal,
            grandTotal: template.grandTotal,
            notes: template.notes,
            terms: template.terms,
            paymentInstructions: template.paymentInstructions,
            lineItems: {
              create: template.lineItems.map(item => ({
                productId: item.productId,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRateId: item.taxRateId,
                taxAmount: item.taxAmount,
                lineTotal: item.lineTotal,
                sortOrder: item.sortOrder
              }))
            }
          }
        });

        // Add Audit Log
        await tx.auditLog.create({
          data: {
            userId: 'SYSTEM',
            action: 'CREATE',
            entityType: 'INVOICE',
            entityId: newInvoice.id,
            changes: JSON.stringify({ reason: 'Auto-generated from schedule', scheduleId: schedule.id })
          }
        });

        // Calculate next run date
        let nextRun = new Date(schedule.nextRunDate);
        if (schedule.frequency === 'WEEKLY') nextRun = addWeeks(nextRun, 1);
        else if (schedule.frequency === 'MONTHLY') nextRun = addMonths(nextRun, 1);
        else if (schedule.frequency === 'QUARTERLY') nextRun = addQuarters(nextRun, 1);
        else if (schedule.frequency === 'YEARLY') nextRun = addYears(nextRun, 1);

        // Update schedule
        await tx.recurringSchedule.update({
          where: { id: schedule.id },
          data: { nextRunDate: nextRun }
        });
        
        generatedCount++;
      });
    }

    return NextResponse.json({ success: true, generated: generatedCount });
  } catch (error) {
    console.error('Cron recurring error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
