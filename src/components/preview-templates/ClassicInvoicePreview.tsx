import type { ThemeColors } from '@/lib/themeColors';

export default function ClassicInvoicePreview({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const c = colors;
  const balanceDue = Math.max(0, invoice.grandTotal - invoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0));

  return (
    <div className="invoice-wrapper !p-12 mb-8 scale-95 origin-top" style={{ backgroundColor: c.bgColor }}>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-light tracking-wider" style={{ color: c.primaryColor }}>INVOICE</h1>
          <div className="mt-2 font-bold text-lg" style={{ color: c.primaryColor }}>{invoice.number}</div>
          <div className={`mt-2 inline-block px-3 py-1 rounded text-xs font-bold border ${invoice.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {invoice.status.replace('_', ' ')}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold mb-4" style={{ color: c.primaryColor }}>{invoice.company?.name || 'Your Company'}</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="font-semibold" style={{ color: c.primaryColor }}>Issue Date:</div>
            <div style={{ color: c.secondaryColor }}>{new Date(invoice.issueDate).toLocaleDateString()}</div>
            <div className="font-semibold" style={{ color: c.primaryColor }}>Due Date:</div>
            <div style={{ color: c.secondaryColor }}>{new Date(invoice.dueDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="text-sm font-bold uppercase mb-2" style={{ color: c.secondaryColor }}>Billed To</div>
        <div className="font-bold text-lg" style={{ color: c.primaryColor }}>{invoice.client.name}</div>
        {invoice.client.clientCompany && <div style={{ color: c.secondaryColor }}>{invoice.client.clientCompany}</div>}
        <div className="text-sm mt-1 whitespace-pre-wrap" style={{ color: c.secondaryColor }}>{invoice.client.billingAddress}</div>
      </div>

      <table className="w-full mb-8 text-sm border-collapse">
        <thead>
          <tr style={{ borderBottomWidth: 2, borderBottomColor: c.primaryColor }}>
            <th className="py-3 text-left w-12" style={{ color: c.primaryColor }}>#</th>
            <th className="py-3 text-left" style={{ color: c.primaryColor }}>Description</th>
            <th className="py-3 text-center w-24" style={{ color: c.primaryColor }}>Qty</th>
            <th className="py-3 text-right w-32" style={{ color: c.primaryColor }}>Price</th>
            <th className="py-3 text-right w-32" style={{ color: c.primaryColor }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item: any, i: number) => (
            <tr key={item.id || i} className="border-b border-gray-200">
              <td className="py-4 font-medium" style={{ color: c.secondaryColor }}>{i + 1}</td>
              <td className="py-4 font-semibold" style={{ color: c.primaryColor }}>{item.description}</td>
              <td className="py-4 text-center" style={{ color: c.secondaryColor }}>{item.quantity}</td>
              <td className="py-4 text-right" style={{ color: c.secondaryColor }}>{invoice.currency} {item.unitPrice.toFixed(2)}</td>
              <td className="py-4 text-right font-semibold" style={{ color: c.primaryColor }}>{invoice.currency} {item.lineTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <div className="w-72">
          <div className="flex justify-between py-2 text-sm" style={{ color: c.secondaryColor }}>
            <span>Subtotal</span><span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.discountAmount > 0 && (
            <div className="flex justify-between py-2 text-sm" style={{ color: c.secondaryColor }}>
              <span>Discount</span><span>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 text-sm" style={{ color: c.secondaryColor }}>
            <span>Tax</span><span>{invoice.currency} {invoice.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 mt-2 font-bold text-lg" style={{ borderTopWidth: 2, borderTopColor: c.primaryColor, color: c.primaryColor }}>
            <span>Total Due</span><span>{invoice.currency} {balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm">
        {invoice.paymentInstructions && (
          <div>
            <div className="font-bold mb-2" style={{ color: c.primaryColor }}>Payment Instructions</div>
            <div className="whitespace-pre-wrap" style={{ color: c.secondaryColor }}>{invoice.paymentInstructions}</div>
          </div>
        )}
        {invoice.terms && (
          <div>
            <div className="font-bold mb-2" style={{ color: c.primaryColor }}>Terms & Conditions</div>
            <div className="whitespace-pre-wrap" style={{ color: c.secondaryColor }}>{invoice.terms}</div>
          </div>
        )}
      </div>
    </div>
  );
}
