'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Copy, Download, Send, CreditCard, Trash2, CheckCircle, Clock } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import { toast } from 'sonner';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '', date: new Date().toISOString().split('T')[0], method: 'BANK_TRANSFER', referenceNumber: '', notes: ''
  });

  const fetchInvoice = async () => {
    setLoading(true);
    const res = await fetch(`/api/invoices/${id}`);
    if (res.ok) {
      const data = await res.json();
      setInvoice(data);
      // Set default payment amount to remaining balance
      const paid = data.payments.reduce((acc: number, p: any) => acc + p.amount, 0);
      setPaymentForm(prev => ({ ...prev, amount: (data.grandTotal - paid).toFixed(2) }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleRecordPayment = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`/api/invoices/${id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentForm)
    });
    
    if (res.ok) {
      toast.success('Payment recorded successfully');
      setShowPaymentModal(false);
      fetchInvoice();
    } else {
      toast.error('Failed to record payment');
    }
  };

  const handleMarkAsSent = async () => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...invoice, status: 'SENT' })
    });
    if (res.ok) {
      toast.success('Invoice marked as sent');
      fetchInvoice();
    } else {
      toast.error('Failed to update invoice status');
    }
  };

  if (loading) return <div className="p-8">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-red-500">Invoice not found</div>;

  const totalPaid = invoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0);
  const balanceDue = Math.max(0, invoice.grandTotal - totalPaid);

  return (
    <div className="main-content">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/invoices" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Invoices
        </Link>
        <div className="flex gap-2">
          <button onClick={() => setShowPaymentModal(true)} className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50" disabled={invoice.status === 'PAID'}>
            <CreditCard size={16} /> Record Payment
          </button>
          
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} />}
            fileName={`${invoice.number}.pdf`}
            className="btn btn-primary"
          >
            {/* @ts-ignore */}
            {({ loading }) => (
              <>
                <Download size={16} /> {loading ? 'Preparing...' : 'Download PDF'}
              </>
            )}
          </PDFDownloadLink>

          <button className="btn bg-blue-600 text-white hover:bg-blue-700" onClick={async () => {
            toast.promise(fetch(`/api/invoices/${id}/send`, { method: 'POST' }), {
              loading: 'Sending email...',
              success: 'Email sent successfully!',
              error: 'Failed to send email.'
            });
          }}>
            <Send size={16} /> Send via Email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {/* Invoice Preview */}
          <div className="invoice-wrapper !p-12 mb-8 scale-95 origin-top">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-wider">INVOICE</h1>
                <div className="mt-2 font-bold text-lg text-gray-900">{invoice.number}</div>
                <div className={`mt-2 inline-block px-3 py-1 rounded text-xs font-bold border ${invoice.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {invoice.status.replace('_', ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 mb-4">Your Company</div>
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
                {invoice.lineItems.map((item: any, i: number) => (
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

        <div className="col-span-1 space-y-6">
          <div className="card">
            <div className="card-body">
              <h3 className="font-bold border-b pb-2 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Edit size={16} /> Edit Invoice
                </button>
                <button className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Copy size={16} /> Duplicate
                </button>
                {invoice.status === 'DRAFT' && (
                  <button onClick={handleMarkAsSent} className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                    <CheckCircle size={16} /> Mark as Sent
                  </button>
                )}
                <button className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-red-50 text-red-600 flex items-center gap-2 mt-4 border-t pt-4">
                  <Trash2 size={16} /> Delete Invoice
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="font-bold border-b pb-2 mb-4">Payment History</h3>
              {invoice.payments.length === 0 ? (
                <div className="text-sm text-gray-500 italic text-center py-4">No payments recorded yet.</div>
              ) : (
                <div className="space-y-4">
                  {invoice.payments.map((payment: any) => (
                    <div key={payment.id} className="border-l-2 border-green-500 pl-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{invoice.currency} {payment.amount.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{payment.method.replace('_', ' ')}</div>
                        </div>
                        <div className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString()}</div>
                      </div>
                      {payment.notes && <div className="text-xs text-gray-500 mt-1 italic">{payment.notes}</div>}
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t mt-4 flex justify-between font-bold text-sm">
                    <span>Total Paid:</span>
                    <span className="text-green-600">{invoice.currency} {totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm mt-1">
                    <span>Balance Due:</span>
                    <span className={balanceDue > 0 ? "text-red-600" : "text-gray-900"}>{invoice.currency} {balanceDue.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4 flex justify-between items-center border">
                <span className="text-sm font-medium text-gray-600">Balance Due:</span>
                <span className="text-lg font-bold text-red-600">{invoice.currency} {balanceDue.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{invoice.currency}</span>
                    <input type="number" required min="0.01" max={balanceDue} step="0.01" className="form-input pl-12" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Payment Date</label>
                  <input type="date" required className="form-input" value={paymentForm.date} onChange={e => setPaymentForm({...paymentForm, date: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="form-label">Payment Method</label>
                <select className="form-input" value={paymentForm.method} onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CARD">Credit/Debit Card</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Reference Number (Optional)</label>
                <input type="text" className="form-input" value={paymentForm.referenceNumber} onChange={e => setPaymentForm({...paymentForm, referenceNumber: e.target.value})} placeholder="Transaction ID, Cheque #, etc." />
              </div>
              
              <div>
                <label className="form-label">Notes (Optional)</label>
                <textarea className="form-input" rows={2} value={paymentForm.notes} onChange={e => setPaymentForm({...paymentForm, notes: e.target.value})} />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" className="btn bg-green-600 text-white hover:bg-green-700">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
