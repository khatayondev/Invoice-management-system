import InvoiceForm from '@/components/InvoiceForm';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewInvoicePage() {
  const session = await getSession();
  if (!session?.user?.companyId) redirect('/login');

  const [companySettings, clients, products] = await Promise.all([
    prisma.company.findUnique({ where: { id: session.user.companyId } }),
    prisma.client.findMany({ where: { companyId: session.user.companyId, deletedAt: null }, orderBy: { name: 'asc' } }),
    prisma.product.findMany({ where: { companyId: session.user.companyId, deletedAt: null }, orderBy: { name: 'asc' } })
  ]);

  if (clients.length === 0) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-body text-center py-16">
            <h2 className="text-xl font-bold mb-4">No Clients Found</h2>
            <p className="text-gray-500 mb-6">You need to add a client before creating an invoice.</p>
            <a href="/clients" className="btn btn-primary">Go to Clients</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content bg-gray-100 min-h-screen">
      <div className="page-header mb-8">
        <div>
          <h2 className="text-2xl font-bold">Create Invoice</h2>
          <p className="text-gray-500">Generate a new invoice for your clients.</p>
        </div>
        <a href="/invoices" className="btn bg-white border shadow-sm hover:bg-gray-50 text-gray-700">Cancel</a>
      </div>
      
      <InvoiceForm 
        companySettings={companySettings} 
        clients={clients} 
        products={products} 
      />
    </div>
  );
}
