import type { ThemeColors } from '@/lib/themeColors';

export default function ProfessionalInvoicePreview({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const c = colors;
  const bal = Math.max(0, invoice.grandTotal - invoice.payments.reduce((a: number, p: any) => a + p.amount, 0));

  return (
    <div className="invoice-wrapper !p-12 mb-8 scale-95 origin-top shadow-sm border border-slate-200" style={{ backgroundColor: c.bgColor }}>
      <div className="text-white p-8 rounded-lg mb-8 flex justify-between items-center shadow-md" style={{ backgroundColor: c.primaryColor }}>
        <div>
          <h1 className="text-3xl font-bold tracking-widest">INVOICE</h1>
          <div className="text-slate-400 mt-2 text-sm uppercase tracking-wider">Invoice #{invoice.number}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg mb-1">{invoice.company?.name || 'Your Company'}</div>
          <div className="text-slate-400 text-sm">{invoice.company?.address}</div>
          <div className="text-slate-400 text-sm">{invoice.company?.email}</div>
          <div className="text-slate-400 text-sm">{invoice.company?.phone}</div>
        </div>
      </div>

      <div className="flex justify-between mb-8 px-2">
        <div className="w-1/2 pr-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c.secondaryColor }}>Billed To:</div>
          <div className="font-bold text-lg" style={{ color: c.primaryColor }}>{invoice.client.name}</div>
          {invoice.client.clientCompany && <div style={{ color: c.secondaryColor }} className="font-medium">{invoice.client.clientCompany}</div>}
          <div className="text-sm whitespace-pre-wrap mt-1" style={{ color: c.secondaryColor }}>{invoice.client.billingAddress}</div>
          {invoice.client.email && <div className="text-sm mt-1" style={{ color: c.secondaryColor }}>{invoice.client.email}</div>}
        </div>
        <div className="w-5/12 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-2">
            <span className="text-sm" style={{ color: c.secondaryColor }}>Issue Date:</span>
            <span className="font-bold text-sm" style={{ color: c.primaryColor }}>{new Date(invoice.issueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-sm" style={{ color: c.secondaryColor }}>Due Date:</span>
            <span className="font-bold text-sm" style={{ color: c.primaryColor }}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm" style={{ color: c.secondaryColor }}>Status:</span>
            <span className={`font-bold text-sm ${invoice.status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>{invoice.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="py-3 px-5 text-left font-bold text-xs uppercase tracking-wider" style={{ color: c.secondaryColor }}>Item</th>
              <th className="py-3 px-5 text-center font-bold text-xs uppercase tracking-wider w-24" style={{ color: c.secondaryColor }}>Qty</th>
              <th className="py-3 px-5 text-right font-bold text-xs uppercase tracking-wider w-32" style={{ color: c.secondaryColor }}>Price</th>
              <th className="py-3 px-5 text-right font-bold text-xs uppercase tracking-wider w-32" style={{ color: c.secondaryColor }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item: any, i: number) => (
              <tr key={item.id || i} className="border-b border-slate-50 last:border-0">
                <td className="py-4 px-5 font-bold" style={{ color: c.primaryColor }}>{item.description}</td>
                <td className="py-4 px-5 text-center" style={{ color: c.secondaryColor }}>{item.quantity}</td>
                <td className="py-4 px-5 text-right" style={{ color: c.secondaryColor }}>{invoice.currency} {item.unitPrice.toFixed(2)}</td>
                <td className="py-4 px-5 text-right font-bold" style={{ color: c.primaryColor }}>{invoice.currency} {item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-10 px-2">
        <div className="w-5/12 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between py-1 text-sm" style={{ color: c.secondaryColor }}>
            <span>Subtotal</span><span>{invoice.currency} {invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.discountAmount > 0 && (
            <div className="flex justify-between py-1 text-sm" style={{ color: c.secondaryColor }}>
              <span>Discount</span><span>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 text-sm mb-2" style={{ color: c.secondaryColor }}>
            <span>Tax</span><span>{invoice.currency} {invoice.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 mt-2 text-lg" style={{ borderTopWidth: 2, borderTopColor: c.primaryColor }}>
            <span className="font-bold" style={{ color: c.primaryColor }}>Total Due</span>
            <span className="font-bold" style={{ color: c.primaryColor }}>{invoice.currency} {bal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="px-2">
        {invoice.paymentInstructions && (
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c.secondaryColor }}>Payment Instructions</div>
            <div className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: c.secondaryColor }}>{invoice.paymentInstructions}</div>
          </div>
        )}
        {invoice.terms && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c.secondaryColor }}>Terms & Conditions</div>
            <div className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: c.secondaryColor }}>{invoice.terms}</div>
          </div>
        )}
      </div>
    </div>
  );
}
