import { use } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  
  if (!session?.user?.companyId) {
    redirect('/auth/login');
  }

  const [companySettings, clients, products, invoice] = await Promise.all([
    prisma.company.findUnique({
      where: { id: session.user.companyId }
    }),
    prisma.client.findMany({
      where: { companyId: session.user.companyId, deletedAt: null },
      orderBy: { name: 'asc' }
    }),
    prisma.product.findMany({
      where: { companyId: session.user.companyId, deletedAt: null },
      orderBy: { name: 'asc' }
    }),
    prisma.invoice.findFirst({
      where: { id, companyId: session.user.companyId, deletedAt: null },
      include: { lineItems: { orderBy: { sortOrder: 'asc' } } }
    })
  ]);

  if (!invoice) {
    return <div className="p-8 text-center text-red-500">Invoice not found or you don't have permission to edit it.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <InvoiceForm 
        companySettings={companySettings} 
        clients={clients} 
        products={products}
        initialData={invoice}
      />
    </div>
  );
}
