import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CreditCard, Download } from 'lucide-react';
import StripeCheckoutButton from './StripeCheckoutButton';

export default async function PublicInvoiceView({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  const invoice = await prisma.invoice.findUnique({
    where: { token },
    include: {
      client: true,
      company: true,
      lineItems: { orderBy: { sortOrder: 'asc' } },
      payments: { orderBy: { date: 'desc' } }
    }
  });

  if (!invoice) return notFound();

  const totalPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);
  const balanceDue = Math.max(0, invoice.grandTotal - totalPaid);

  const isStripeConfigured = !!(invoice.company.stripeSecretKey);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{invoice.company.name}</h1>
          </div>
          <div className="flex gap-3">
            {balanceDue > 0 && isStripeConfigured && (
              <StripeCheckoutButton invoiceId={invoice.id} amount={balanceDue} currency={invoice.currency} />
            )}
            <button className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm" onClick={() => window.print()}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-12 mb-8">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-light text-gray-900 tracking-wider">INVOICE</h2>
              <div className="mt-2 font-bold text-lg text-gray-900">{invoice.number}</div>
              <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${invoice.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {invoice.status.replace('_', ' ')}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 mb-4">{invoice.company.name}</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                <div className="font-semibold text-gray-900">Issue Date:</div>
                <div>{new Date(invoice.issueDate).toLocaleDateString()}</div>
                <div className="font-semibold text-gray-900">Due Date:</div>
                <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="text-sm font-bold text-gray-500 uppercase mb-2">Billed To</div>
            <div className="font-bold text-lg text-gray-900">{invoice.client.name}</div>
            {invoice.client.clientCompany && <div className="text-gray-600">{invoice.client.clientCompany}</div>}
            <div className="text-gray-500 text-sm mt-1 whitespace-pre-wrap">{invoice.client.billingAddress}</div>
          </div>

          <table className="w-full mb-8 text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-gray-900">
                <th className="py-3 text-left w-12">#</th>
                <th className="py-3 text-left">Description</th>
                <th className="py-3 text-center w-24">Qty</th>
                <th className="py-3 text-right w-32">Price</th>
                <th className="py-3 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4 font-medium text-gray-500">{i + 1}</td>
                  <td className="py-4 font-semibold text-gray-900">{item.description}</td>
                  <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">{invoice.currency} {item.unitPrice.toFixed(2)}</td>
                  <td className="py-4 text-right font-semibold text-gray-900">{invoice.currency} {item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-12">
            <div className="w-72">
              <div className="flex justify-between py-2 text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between py-2 text-sm text-gray-600">
                  <span>Discount</span>
                  <span>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm text-gray-600">
                <span>Tax</span>
                <span>{invoice.currency} {invoice.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 mt-2 border-t-2 border-gray-900 font-bold text-lg text-gray-900">
                <span>Total Due</span>
                <span>{invoice.currency} {balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            {invoice.paymentInstructions && (
              <div>
                <div className="font-bold text-gray-900 mb-2">Payment Instructions</div>
                <div className="text-gray-600 whitespace-pre-wrap">{invoice.paymentInstructions}</div>
              </div>
            )}
            {invoice.terms && (
              <div>
                <div className="font-bold text-gray-900 mb-2">Terms & Conditions</div>
                <div className="text-gray-600 whitespace-pre-wrap">{invoice.terms}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
