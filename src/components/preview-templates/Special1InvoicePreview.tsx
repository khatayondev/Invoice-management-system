import type { ThemeColors } from '@/lib/themeColors';

/** Convert a number to words (simple version) */
function numberToWords(num: number): string {
  if (num === 0) return 'ZERO';

  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
    'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 ? ' AND ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' THOUSAND' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    return convert(Math.floor(n / 1000000)) + ' MILLION' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
  };

  return convert(Math.floor(num));
}

export default function Special1InvoicePreview({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const c = colors;
  const balanceDue = Math.max(0, invoice.grandTotal - invoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0));

  const formatDate = (d: string) => {
    const date = new Date(d);
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} ${date.toLocaleDateString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
  };

  // Parse payment instructions into bank info key-value pairs
  const parseBankInfo = (instructions: string | undefined) => {
    if (!instructions) return [];
    return instructions.split('\n').filter(Boolean).map(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > -1) {
        return { label: line.substring(0, colonIdx + 1).trim(), value: line.substring(colonIdx + 1).trim() };
      }
      return { label: '', value: line.trim() };
    });
  };

  return (
    <div className="invoice-wrapper !p-12 mb-8 scale-95 origin-top" style={{ backgroundColor: c.bgColor }}>
      {/* ── Company Header ── */}
      <div className="text-center mb-2">
        <h1
          className="text-xl font-extrabold uppercase tracking-wide"
          style={{ color: c.primaryColor }}
        >
          {invoice.company?.name || 'Your Company'}
        </h1>
        <p className="text-xs mt-1" style={{ color: c.secondaryColor }}>
          {invoice.company?.address}
        </p>
      </div>
      <div className="mb-6" style={{ borderBottomWidth: 1, borderBottomColor: c.primaryColor, borderBottomStyle: 'solid' }} />

      {/* ── Invoice Label + Info ── */}
      <div className="flex justify-between items-start mb-6">
        <div
          className="border-2 px-4 py-1.5"
          style={{ borderColor: c.primaryColor }}
        >
          <span
            className="text-sm font-extrabold uppercase tracking-wide"
            style={{ color: c.primaryColor }}
          >
            Proforma Invoice
          </span>
        </div>
        <div className="text-right text-sm">
          <div className="mb-0.5" style={{ color: '#444' }}>
            INVOICE NO: <span className="font-bold" style={{ color: c.primaryColor }}>{invoice.number}</span>
          </div>
          <div className="mb-0.5" style={{ color: '#444' }}>
            INVOICE DATE: {formatDate(invoice.issueDate)}
          </div>
          <div style={{ color: '#444' }}>
            DUE DATE: {formatDate(invoice.dueDate)}
          </div>
        </div>
      </div>

      {/* ── Status Badge ── */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded text-xs font-bold border ${
            invoice.status === 'PAID'
              ? 'bg-green-100 text-green-700 border-green-200'
              : invoice.status === 'OVERDUE'
                ? 'bg-red-100 text-red-700 border-red-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}
        >
          {invoice.status.replace('_', ' ')}
        </span>
      </div>

      {/* ── Consignee ── */}
      <div className="mb-8">
        <div
          className="text-xs font-bold uppercase tracking-wide mb-1"
          style={{ color: c.primaryColor }}
        >
          Consignee To :
        </div>
        <div className="text-sm leading-relaxed" style={{ color: '#333' }}>
          <div>{invoice.client?.name}</div>
          {invoice.client?.clientCompany && <div>{invoice.client.clientCompany}</div>}
          {invoice.client?.billingAddress && (
            <div className="whitespace-pre-wrap">{invoice.client.billingAddress}</div>
          )}
          {invoice.client?.email && <div className="mt-0.5">{invoice.client.email}</div>}
        </div>
      </div>

      {/* ── Items Table ── */}
      <div className="border mb-1" style={{ borderColor: '#333' }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: c.primaryColor }}>
              <th className="py-2.5 px-3 text-left text-xs font-bold text-white uppercase tracking-wide">
                Description of Goods
              </th>
              <th className="py-2.5 px-3 text-center text-xs font-bold text-white uppercase tracking-wide">
                Unit Price
              </th>
              <th className="py-2.5 px-3 text-center text-xs font-bold text-white uppercase tracking-wide">
                Qty/Pcs
              </th>
              <th className="py-2.5 px-3 text-right text-xs font-bold text-white uppercase tracking-wide">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item: any, i: number) => (
              <tr
                key={item.id || i}
                className={`border-b ${i % 2 !== 0 ? 'bg-gray-50' : ''}`}
                style={{ borderColor: '#E0E0E0' }}
              >
                <td className="py-3 px-3">{item.description}</td>
                <td className="py-3 px-3 text-center" style={{ color: '#555' }}>
                  {invoice.currency} {item.unitPrice.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-center" style={{ color: '#555' }}>
                  {item.quantity}
                </td>
                <td className="py-3 px-3 text-right font-bold">
                  {invoice.currency} {item.lineTotal.toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Subtotal / Discount / Tax rows */}
            {(invoice.discountAmount > 0 || invoice.taxTotal > 0) && (
              <>
                <tr className="border-b" style={{ borderColor: '#E0E0E0' }}>
                  <td className="py-2 px-3" colSpan={2}></td>
                  <td className="py-2 px-3 text-right font-bold text-xs">Subtotal:</td>
                  <td className="py-2 px-3 text-right font-bold">
                    {invoice.currency} {invoice.subtotal.toFixed(2)}
                  </td>
                </tr>
                {invoice.discountAmount > 0 && (
                  <tr className="border-b" style={{ borderColor: '#E0E0E0' }}>
                    <td className="py-2 px-3" colSpan={2}></td>
                    <td className="py-2 px-3 text-right font-bold text-xs">Discount:</td>
                    <td className="py-2 px-3 text-right font-bold">
                      -{invoice.currency} {invoice.discountAmount.toFixed(2)}
                    </td>
                  </tr>
                )}
                {invoice.taxTotal > 0 && (
                  <tr className="border-b" style={{ borderColor: '#E0E0E0' }}>
                    <td className="py-2 px-3" colSpan={2}></td>
                    <td className="py-2 px-3 text-right font-bold text-xs">Tax:</td>
                    <td className="py-2 px-3 text-right font-bold">
                      {invoice.currency} {invoice.taxTotal.toFixed(2)}
                    </td>
                  </tr>
                )}
              </>
            )}

            {/* Grand Total */}
            <tr style={{ borderTopWidth: 2, borderTopColor: c.primaryColor, borderTopStyle: 'solid' }}>
              <td colSpan={3} className="py-3 px-3 text-right font-extrabold text-base" style={{ color: c.primaryColor }}>
                Total: {invoice.currency}
              </td>
              <td className="py-3 px-3 text-right font-extrabold text-base" style={{ color: c.primaryColor }}>
                {balanceDue.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Terms / Total in Words ── */}
      <div className="mt-5 mb-5">
        {!!invoice.terms && (
          <>
            <div
              className="text-xs font-bold uppercase tracking-wide mb-0.5"
              style={{ color: c.primaryColor }}
            >
              Terms of Payment:
            </div>
            <div className="text-xs mb-2 whitespace-pre-wrap" style={{ color: '#444' }}>
              {invoice.terms}
            </div>
          </>
        )}
        <div
          className="text-xs font-bold uppercase tracking-wide mb-0.5"
          style={{ color: c.primaryColor }}
        >
          Total in Words:
        </div>
        <div className="text-xs" style={{ color: '#444' }}>
          {numberToWords(Math.floor(balanceDue))} {invoice.currency}
        </div>
      </div>

      {/* ── Bank Information ── */}
      {!!invoice.paymentInstructions && (
        <div className="mt-3">
          <h3
            className="text-base font-extrabold uppercase mb-3"
            style={{ color: c.primaryColor }}
          >
            Bank Information
          </h3>
          <div className="space-y-1">
            {parseBankInfo(invoice.paymentInstructions).map((row, i) => (
              <div key={i} className="flex text-xs">
                {row.label ? (
                  <>
                    <span
                      className="font-bold uppercase w-40 shrink-0"
                      style={{ color: c.primaryColor }}
                    >
                      {row.label}
                    </span>
                    <span className="uppercase" style={{ color: '#333' }}>
                      {row.value}
                    </span>
                  </>
                ) : (
                  <span className="uppercase" style={{ color: '#333' }}>
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
