import type { ThemeColors } from '@/lib/themeColors';

export default function MinimalInvoicePreview({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const c = colors;
  const bal = Math.max(0, invoice.grandTotal - invoice.payments.reduce((a: number, p: any) => a + p.amount, 0));

  return (
    <div className="invoice-wrapper !p-16 mb-8 scale-95 origin-top shadow-sm border border-gray-100 font-sans" style={{ backgroundColor: c.bgColor, color: c.primaryColor }}>
      <div className="mb-16">
        <h1 className="text-2xl font-bold mb-1 tracking-tight">{invoice.company?.name || 'Your Company'}</h1>
        <div className="text-sm" style={{ color: c.secondaryColor }}>{invoice.company?.address}</div>
        <div className="text-sm" style={{ color: c.secondaryColor }}>{invoice.company?.email} {invoice.company?.phone ? `| ${invoice.company.phone}` : ''}</div>
      </div>
      <div className="border-t mb-10" style={{ borderColor: c.secondaryColor, opacity: 0.3 }}></div>
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: c.secondaryColor }}>Invoice To</div>
          <div className="font-bold text-base mb-1">{invoice.client.name}</div>
          {invoice.client.clientCompany && <div className="text-sm mb-1" style={{ color: c.secondaryColor }}>{invoice.client.clientCompany}</div>}
          <div className="text-sm whitespace-pre-wrap" style={{ color: c.secondaryColor }}>{invoice.client.billingAddress}</div>
          {invoice.client.email && <div className="text-sm mt-1" style={{ color: c.secondaryColor }}>{invoice.client.email}</div>}
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: c.secondaryColor }}>Invoice Details</div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div style={{ color: c.secondaryColor }}>Invoice Number:</div>
            <div className="font-bold">{invoice.number}</div>
            <div style={{ color: c.secondaryColor }}>Issue Date:</div>
            <div>{new Date(invoice.issueDate).toLocaleDateString()}</div>
            <div style={{ color: c.secondaryColor }}>Due Date:</div>
            <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <table className="w-full mb-12 text-sm">
        <thead>
          <tr style={{ borderBottomWidth: 1, borderBottomColor: c.primaryColor }}>
            <th className="py-3 text-left font-normal text-xs uppercase tracking-wider" style={{ color: c.secondaryColor }}>Description</th>
            <th className="py-3 text-center font-normal text-xs uppercase tracking-wider w-24" style={{ color: c.secondaryColor }}>Qty</th>
            <th className="py-3 text-right font-normal text-xs uppercase tracking-wider w-32" style={{ color: c.secondaryColor }}>Price</th>
            <th className="py-3 text-right font-normal text-xs uppercase tracking-wider w-32" style={{ color: c.secondaryColor }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item: any, i: number) => (
            <tr key={item.id || i} className="border-b border-gray-100">
              <td className="py-4 font-bold">{item.description}</td>
              <td className="py-4 text-center" style={{ color: c.secondaryColor }}>{item.quantity}</td>
              <td className="py-4 text-right" style={{ color: c.secondaryColor }}>{invoice.currency} {item.unitPrice.toFixed(2)}</td>
              <td className="py-4 text-right">{invoice.currency} {item.lineTotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-16">
        <div className="w-64">
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
          <div className="flex justify-between py-3 mt-2 font-bold text-lg" style={{ borderTopWidth: 1, borderTopColor: c.primaryColor }}>
            <span>Total Due</span><span>{invoice.currency} {bal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-sm">
        {invoice.paymentInstructions && (
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.secondaryColor }}>Payment Info</div>
            <div className="whitespace-pre-wrap" style={{ color: c.secondaryColor }}>{invoice.paymentInstructions}</div>
          </div>
        )}
        {invoice.terms && (
          <div>
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: c.secondaryColor }}>Terms</div>
            <div className="whitespace-pre-wrap" style={{ color: c.secondaryColor }}>{invoice.terms}</div>
          </div>
        )}
      </div>
    </div>
  );
}
