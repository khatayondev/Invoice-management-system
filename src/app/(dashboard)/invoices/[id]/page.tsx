'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Copy, Download, Send, CreditCard, Trash2, CheckCircle, Clock } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import InvoicePreview from '@/components/InvoicePreview';
import { toast } from 'sonner';
import { getDefaultColors, getThemeColors, COLOR_PRESETS } from '@/lib/themeColors';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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

  const handleThemeChange = async (newTheme: string) => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...invoice, pdfTheme: newTheme })
    });
    if (res.ok) {
      toast.success('Theme updated successfully');
      setInvoice({ ...invoice, pdfTheme: newTheme });
    } else {
      toast.error('Failed to update theme');
    }
  };

  if (loading) return <div className="p-8">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-red-500">Invoice not found</div>;

  const currentColors = getThemeColors(invoice.pdfTheme || 'CLASSIC', invoice.themeColors);

  const handleColorChange = async (key: string, value: string) => {
    const newColors = { ...currentColors, [key]: value };
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...invoice, themeColors: newColors })
    });
    if (res.ok) {
      setInvoice({ ...invoice, themeColors: newColors });
    }
  };

  const handleResetColors = async () => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...invoice, themeColors: null })
    });
    if (res.ok) {
      setInvoice({ ...invoice, themeColors: null });
      toast.success('Colors reset to default');
    }
  };

  const handlePresetChange = async (presetColors: any) => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...invoice, themeColors: presetColors })
    });
    if (res.ok) {
      setInvoice({ ...invoice, themeColors: presetColors });
      toast.success('Preset applied');
    }
  };

  const handleDuplicate = async () => {
    const res = await fetch(`/api/invoices/${id}/duplicate`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      toast.success('Invoice duplicated');
      window.location.href = `/invoices/${data.invoice.id}`;
    } else {
      toast.error('Failed to duplicate invoice');
    }
  };

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
          
          {mounted ? (
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
          ) : (
            <button className="btn btn-primary opacity-50 cursor-not-allowed">
              <Download size={16} /> Loading PDF...
            </button>
          )}

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
          <InvoicePreview invoice={invoice} />
        </div>

        <div className="col-span-1 space-y-6">
          <div className="card">
            <div className="card-body">
              <h3 className="font-bold border-b pb-2 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <div className="pb-3 border-b border-gray-100 mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Invoice Theme</label>
                  <select 
                    className="w-full text-sm font-medium rounded-md border-gray-200 p-2 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary/20"
                    value={invoice.pdfTheme || 'CLASSIC'}
                    onChange={(e) => handleThemeChange(e.target.value)}
                  >
                    <option value="CLASSIC">Classic</option>
                    <option value="MODERN">Modern</option>
                    <option value="MINIMAL">Minimal</option>
                    <option value="PROFESSIONAL">Professional</option>
                  </select>
                </div>
                
                <div className="pb-3 border-b border-gray-100 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase block">Colors</label>
                    {invoice.themeColors && (
                      <button onClick={handleResetColors} className="text-[10px] text-gray-400 hover:text-brand-primary underline">Reset</button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1 text-center">Primary</div>
                      <input 
                        type="color" 
                        value={currentColors.primaryColor} 
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="w-full h-8 rounded cursor-pointer border-0 p-0"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1 text-center">Secondary</div>
                      <input 
                        type="color" 
                        value={currentColors.secondaryColor} 
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="w-full h-8 rounded cursor-pointer border-0 p-0"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 mb-1 text-center">Background</div>
                      <input 
                        type="color" 
                        value={currentColors.bgColor} 
                        onChange={(e) => handleColorChange('bgColor', e.target.value)}
                        className="w-full h-8 rounded cursor-pointer border-0 p-0"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-[10px] text-gray-500 mb-1.5 font-medium">Presets</div>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          title={preset.name}
                          onClick={() => handlePresetChange(preset.colors)}
                          className="w-5 h-5 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform"
                          style={{ backgroundColor: preset.colors.primaryColor }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Link href={`/invoices/${id}/edit`} className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Edit size={16} /> Edit Invoice
                </Link>
                <button onClick={handleDuplicate} className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Copy size={16} /> Duplicate
                </button>
                {invoice.status === 'DRAFT' && (
                  <button onClick={handleMarkAsSent} className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                    <CheckCircle size={16} /> Mark as Sent
                  </button>
                )}
                <button onClick={async () => {
                  if (!window.confirm(`Are you sure you want to delete invoice ${invoice.number}?`)) return;
                  const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
                  if (res.ok) {
                    toast.success('Invoice deleted');
                    window.location.href = '/invoices';
                  } else toast.error('Failed to delete invoice');
                }} className="w-full text-left px-3 py-2 text-sm font-medium rounded hover:bg-red-50 text-red-600 flex items-center gap-2 mt-4 border-t pt-4">
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
