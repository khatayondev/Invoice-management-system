'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { CURRENCIES, DEFAULT_CURRENCY, getCurrencySymbol } from '@/lib/currencies';
import { getDefaultColors, COLOR_PRESETS } from '@/lib/themeColors';

export default function InvoiceForm({ companySettings, clients, products, initialData }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultClientId = searchParams.get('client');
  
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [clientId, setClientId] = useState(initialData?.clientId || defaultClientId || '');
  const [issueDate, setIssueDate] = useState(initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Default 15 days
  const [currency, setCurrency] = useState(initialData?.currency || companySettings?.defaultCurrency || DEFAULT_CURRENCY);
  const [pdfTheme, setPdfTheme] = useState(initialData?.pdfTheme || 'CLASSIC');
  const [themeColors, setThemeColors] = useState<any>(initialData?.themeColors ? JSON.parse(initialData.themeColors) : null);

  // Derived current colors
  const currentColors = themeColors || getDefaultColors(pdfTheme);
  
  // Line Items
  const [items, setItems] = useState(initialData?.lineItems?.map((item: any) => ({
    id: item.id || Math.random().toString(36).substr(2, 9),
    productId: item.productId || '',
    description: item.description || '',
    quantity: item.quantity || 1,
    unitPrice: item.unitPrice || 0,
    taxAmount: item.taxAmount || 0,
    lineTotal: item.lineTotal || 0
  })) || [
    { id: Date.now(), productId: '', description: '', quantity: 1, unitPrice: 0, taxAmount: 0 }
  ]);
  
  // Totals & Terms
  const [discountType, setDiscountType] = useState(initialData?.discountType || 'PERCENTAGE'); // PERCENTAGE, FIXED
  const [discountValue, setDiscountValue] = useState(initialData?.discountValue || 0);
  const [notes, setNotes] = useState(initialData?.notes !== undefined ? initialData.notes : (companySettings?.defaultNotes || ''));
  const [terms, setTerms] = useState(initialData?.terms !== undefined ? initialData.terms : (companySettings?.defaultTerms || ''));
  const [paymentInstructions, setPaymentInstructions] = useState(initialData?.paymentInstructions !== undefined ? initialData.paymentInstructions : (companySettings?.paymentInstructions || ''));

  // Derived calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (discountType === 'PERCENTAGE') {
      return subtotal * (discountValue / 100);
    }
    return discountValue;
  }, [subtotal, discountType, discountValue]);

  const taxTotal = useMemo(() => {
    // If we were using tax rates per item, we'd sum item.taxAmount. For simplicity, we'll apply default company tax to the subtotal after discount
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    return taxableAmount * ((companySettings?.defaultTaxRate || 0) / 100);
  }, [subtotal, discountAmount, companySettings]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + taxTotal);
  }, [subtotal, discountAmount, taxTotal]);

  const addItem = () => setItems([...items, { id: Date.now(), productId: '', description: '', quantity: 1, unitPrice: 0, taxAmount: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill product details if productId changes
    if (field === 'productId' && value) {
      const product = products.find((p: any) => p.id === value);
      if (product) {
        newItems[index].description = product.name;
        newItems[index].unitPrice = product.defaultPrice;
      }
    }
    
    setItems(newItems);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const invoiceData = {
      clientId,
      issueDate,
      dueDate,
      currency,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxTotal,
      grandTotal,
      notes,
      terms,
      paymentInstructions,
      pdfTheme,
      themeColors: themeColors ? JSON.stringify(themeColors) : null,
      lineItems: items.map(item => ({
        ...item,
        lineTotal: item.quantity * item.unitPrice
      }))
    };

    try {
      const url = initialData?.id ? `/api/invoices/${initialData.id}` : '/api/invoices';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      
      if (res.ok) {
        if (initialData?.id) {
          router.push(`/invoices/${initialData.id}`);
        } else {
          const { invoice } = await res.json();
          router.push(`/invoices/${invoice.id}`);
        }
      } else {
        alert('Failed to save invoice');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving invoice');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="invoice-wrapper pb-16">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-light text-gray-900 tracking-wider">
              {initialData?.id ? 'EDIT INVOICE' : 'NEW INVOICE'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {initialData?.id ? `Editing ${initialData.number}` : 'Number will be auto-generated'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-900">{companySettings?.name || 'Your Company'}</div>
          <div className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{companySettings?.address}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <label className="form-label">Billed To</label>
          <select 
            required
            className="form-input mb-4" 
            value={clientId} 
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="" disabled>Select a client...</option>
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name} {c.clientCompany ? `(${c.clientCompany})` : ''}</option>
            ))}
          </select>
          {clientId && (
            <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-600">
              {clients.find((c: any) => c.id === clientId)?.billingAddress || 'No billing address saved for this client.'}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="form-label">Issue Date</label>
            <input type="date" required className="form-input" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Due Date</label>
            <input type="date" required className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Currency</label>
            <select className="form-input" value={currency} onChange={e => setCurrency(e.target.value)}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} ({c.symbol}) — {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">PDF Theme</label>
            <select className="form-input" value={pdfTheme} onChange={e => {
              setPdfTheme(e.target.value);
              setThemeColors(null); // Reset colors when theme changes
            }}>
              <option value="CLASSIC">Classic</option>
              <option value="MODERN">Modern</option>
              <option value="MINIMAL">Minimal</option>
              <option value="PROFESSIONAL">Professional</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="form-label mb-0">Colors</label>
              {themeColors && (
                <button type="button" onClick={() => setThemeColors(null)} className="text-[10px] text-gray-400 hover:text-brand-primary underline">Reset</button>
              )}
            </div>
            <div className="flex gap-2 mb-2">
              <input 
                type="color" 
                value={currentColors.primaryColor} 
                onChange={(e) => setThemeColors({ ...currentColors, primaryColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                title="Primary Color"
              />
              <input 
                type="color" 
                value={currentColors.secondaryColor} 
                onChange={(e) => setThemeColors({ ...currentColors, secondaryColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                title="Secondary Color"
              />
              <input 
                type="color" 
                value={currentColors.bgColor} 
                onChange={(e) => setThemeColors({ ...currentColors, bgColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                title="Background Color"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  title={preset.name}
                  onClick={() => setThemeColors(preset.colors)}
                  className="w-4 h-4 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: preset.colors.primaryColor }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <table className="w-full mb-4">
          <thead>
            <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-200">
              <th className="pb-3 w-1/3">Item / Description</th>
              <th className="pb-3 text-center w-24">Qty</th>
              <th className="pb-3 text-right w-32">Price</th>
              <th className="pb-3 text-right w-32">Amount</th>
              <th className="pb-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="border-b border-gray-100 group">
                <td className="py-4 pr-4">
                  <div className="space-y-2">
                    <select 
                      className="form-input text-sm"
                      value={item.productId}
                      onChange={(e) => updateItem(i, 'productId', e.target.value)}
                    >
                      <option value="">-- Custom Item --</option>
                      {products.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input 
                      required
                      placeholder="Description"
                      className="form-input-clean text-sm border border-transparent focus:border-gray-200 p-2 rounded" 
                      value={item.description} 
                      onChange={e => updateItem(i, 'description', e.target.value)} 
                    />
                  </div>
                </td>
                <td className="py-4 px-2 align-top pt-5 text-center">
                  <input 
                    type="number" 
                    required min="0.01" step="0.01"
                    className="form-input text-center p-2" 
                    value={item.quantity || ''} 
                    onChange={e => updateItem(i, 'quantity', Number(e.target.value))} 
                  />
                </td>
                <td className="py-4 px-2 align-top pt-5 text-right">
                  <input 
                    type="number" 
                    required min="0" step="0.01"
                    className="form-input text-right p-2" 
                    value={item.unitPrice || ''} 
                    onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} 
                  />
                </td>
                <td className="py-4 px-2 align-top pt-7 text-right font-semibold text-gray-900">
                  {currency} {(item.quantity * item.unitPrice).toFixed(2)}
                </td>
                <td className="py-4 align-top pt-6 text-right">
                  <button 
                    type="button" 
                    onClick={() => removeItem(i)} 
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    disabled={items.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <button type="button" onClick={addItem} className="btn btn-dashed">
          <Plus size={16} /> Add Line Item
        </button>
      </div>

      <div className="flex gap-12 mt-12 border-t pt-8">
        <div className="flex-1 space-y-6">
          <div>
            <label className="form-label">Payment Instructions</label>
            <textarea 
              className="form-input" 
              rows={3} 
              value={paymentInstructions} 
              onChange={e => setPaymentInstructions(e.target.value)} 
            />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea 
              className="form-input" 
              rows={2} 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
            />
          </div>
          <div>
            <label className="form-label">Terms & Conditions</label>
            <textarea 
              className="form-input" 
              rows={2} 
              value={terms} 
              onChange={e => setTerms(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="w-80 bg-gray-50 rounded-lg p-6 flex flex-col h-fit">
          <div className="flex justify-between mb-4 text-sm font-medium text-gray-600">
            <span>Subtotal</span>
            <span>{currency} {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-4 text-sm font-medium text-gray-600 items-center">
            <span>Discount</span>
            <div className="flex items-center gap-2 w-32">
              <input 
                type="number" 
                min="0" step="any"
                className="form-input p-1 text-right text-sm h-8" 
                value={discountValue || ''} 
                onChange={e => setDiscountValue(Number(e.target.value))} 
              />
              <select 
                className="form-input p-1 text-sm h-8 bg-transparent border-transparent"
                value={discountType}
                onChange={e => setDiscountType(e.target.value)}
              >
                <option value="PERCENTAGE">%</option>
                <option value="FIXED">{currency}</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between mb-4 text-sm font-medium text-gray-600 items-center">
            <span>Tax ({companySettings?.defaultTaxRate || 0}%)</span>
            <span>{currency} {taxTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{currency} {grandTotal.toFixed(2)}</span>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full mt-8 py-4 text-lg"
          >
            {loading ? 'Saving...' : <><Save size={20} /> Save Invoice</>}
          </button>
        </div>
      </div>
    </form>
  );
}
