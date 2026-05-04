import type { ThemeColors } from '@/lib/themeColors';

export default function ModernInvoicePreview({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const c = colors;
  const bal = Math.max(0, invoice.grandTotal - invoice.payments.reduce((a: number, p: any) => a + p.amount, 0));

  return (
    <div className="invoice-wrapper relative !p-0 mb-8 scale-95 origin-top bg-white shadow-sm border border-gray-200 overflow-hidden flex" style={{ backgroundColor: c.bgColor }}>
      <div className="w-4 flex-shrink-0" style={{ backgroundColor: c.primaryColor }}></div>
      <div className="flex-1 p-12">
        <div className="flex justify-between items-center border-b-2 border-gray-100 pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-wide" style={{ color: c.primaryColor }}>INVOICE</h1>
            <div className="mt-2 font-medium" style={{ color: c.secondaryColor }}>#{invoice.number}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-gray-900 mb-1">{invoice.company?.name || 'Your Company'}</div>
            <div className="text-sm text-gray-600">{invoice.company?.address}</div>
            <div className="text-sm text-gray-600">{invoice.company?.email}</div>
            <div className="text-sm text-gray-600">{invoice.company?.phone}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-10">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c.secondaryColor }}>Billed To</div>
            <div className="font-bold text-lg text-gray-900">{invoice.client.name}</div>
            {invoice.client.clientCompany && <div className="text-gray-700 font-medium mb-1">{invoice.client.clientCompany}</div>}
            <div className="text-gray-600 text-sm whitespace-pre-wrap">{invoice.client.billingAddress}</div>
            {invoice.client.email && <div className="text-gray-600 text-sm mt-2">{invoice.client.email}</div>}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col justify-center">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Issue Date:</span>
              <span className="font-bold text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-bold text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            <div className={`inline-flex self-start px-3 py-1 rounded text-xs font-bold ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
              {invoice.status.replace('_', ' ')}
            </div>
          </div>
        </div>

        <table className="w-full mb-10 text-sm border-collapse">
          <thead>
            <tr className="rounded-lg overflow-hidden text-white" style={{ backgroundColor: c.primaryColor }}>
              <th className="py-3 px-4 text-left font-semibold first:rounded-l-lg">#</th>
              <th className="py-3 px-4 text-left font-semibold">Description</th>
              <th className="py-3 px-4 text-center font-semibold">Qty</th>
              <th className="py-3 px-4 text-right font-semibold">Price</th>
              <th className="py-3 px-4 text-right font-semibold last:rounded-r-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item: any, i: number) => (
              <tr key={item.id || i} className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-500">{i + 1}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">{item.description}</td>
                <td className="py-4 px-4 text-center text-gray-600">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-gray-600">{invoice.currency} {item.unitPrice.toFixed(2)}</td>
                <td className="py-4 px-4 text-right font-semibold text-gray-900">{invoice.currency} {item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-12">
          <div className="w-80">
            <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
              <span>Subtotal</span><span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
                <span>Discount</span><span>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
              <span>Tax</span><span>{invoice.currency} {invoice.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-4 mt-2 bg-slate-50 px-4 rounded-lg font-bold text-lg" style={{ color: c.primaryColor }}>
              <span>Total Due</span><span>{invoice.currency} {bal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 text-sm mt-12 pt-8 border-t border-gray-100">
          {invoice.paymentInstructions && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c.secondaryColor }}>Payment Instructions</div>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">{invoice.paymentInstructions}</div>
            </div>
          )}
          {invoice.terms && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c.secondaryColor }}>Terms & Conditions</div>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">{invoice.terms}</div>
            </div>
          )}
        </div>

        <div className="text-center mt-16 text-xs text-gray-400">
          Thank you for your business! | {invoice.company?.website || invoice.company?.name}
        </div>
      </div>
    </div>
  );
}
