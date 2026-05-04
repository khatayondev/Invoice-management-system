'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Eye, Edit, Download, Upload, Trash2, FileText, CheckCircle2, Clock, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';
import ActionDropdown from '@/components/ActionDropdown';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    let url = `/api/invoices?search=${encodeURIComponent(search)}`;
    if (statusFilter) url += `&status=${statusFilter}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
        setLoading(false);
      });
  }, [search, statusFilter]);

  const exportToCSV = () => {
    if (!invoices || invoices.length === 0) {
      alert("No invoices to export.");
      return;
    }
    const headers = ['Invoice Number', 'Client', 'Issue Date', 'Due Date', 'Amount', 'Status'];
    const rows = invoices.map(inv => [
      inv.number,
      `"${inv.client?.name || 'Unknown'}"`,
      new Date(inv.issueDate).toLocaleDateString(),
      new Date(inv.dueDate).toLocaleDateString(),
      inv.grandTotal.toString(),
      inv.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invoices_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Logic to handle file upload would go here
      alert(`File "${file.name}" selected for upload. Backend processing to be implemented.`);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Quick Stats Calculations (based on currently loaded data for demo purposes)
  const totalInvoices = invoices.length;
  const paidAmount = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.grandTotal, 0);
  const outstandingAmount = invoices.filter(i => ['SENT', 'DRAFT', 'PARTIALLY_PAID', 'OVERDUE'].includes(i.status)).reduce((sum, i) => sum + i.grandTotal, 0);
  const overdueAmount = invoices.filter(i => i.status === 'OVERDUE').reduce((sum, i) => sum + i.grandTotal, 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'DRAFT': return 'bg-gray-200 text-gray-700';
      case 'SENT': return 'bg-blue-100 text-blue-700';
      case 'OVERDUE': return 'bg-red-100 text-red-700 shadow-sm shadow-red-200';
      case 'PARTIALLY_PAID': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { label: 'All Invoices', value: '' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Pending', value: 'SENT' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Drafts', value: 'DRAFT' },
  ];

  return (
    <div className="mt-2 md:mt-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Invoices</h2>
          <p className="text-gray-500 font-medium mt-1">Manage, track, and create new invoices.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportToCSV} className="btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm">
            <Download size={18} /> Export CSV
          </button>
          <Link href="/invoices/new" className="btn btn-primary shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 transition-transform">
            <Plus size={18} /> Create Invoice
          </Link>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Total Invoices</p>
              <h4 className="text-2xl font-black text-gray-900">{totalInvoices}</h4>
            </div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Paid Amount</p>
              <h4 className="text-2xl font-black text-gray-900">${paidAmount.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Outstanding</p>
              <h4 className="text-2xl font-black text-gray-900">${outstandingAmount.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Overdue</p>
              <h4 className="text-2xl font-black text-gray-900">${overdueAmount.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        
        {/* Filter & Search Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/30">
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100/80 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  statusFilter === tab.value 
                    ? 'bg-white text-brand-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by invoice # or client..." 
              className="form-input pl-10 py-2.5 bg-white shadow-sm border-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="hidden md:block overflow-x-auto p-4">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Invoice</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Client</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Date Issued</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Due Date</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Amount</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-center">Status</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500 font-medium">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mr-3 align-middle"></div>
                  Loading invoices...
                </td></tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 mb-4 shadow-inner">
                      <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No invoices found</h3>
                    <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : invoices.map((invoice: any) => (
                <tr key={invoice.id} className="bg-white hover:bg-gray-50 hover:shadow-md transition-all rounded-xl group">
                  <td className="py-4 px-4 rounded-l-xl border-y border-l border-transparent group-hover:border-gray-100 font-black text-gray-900">
                    {invoice.number}
                  </td>
                  <td className="py-4 px-4 border-y border-transparent group-hover:border-gray-100">
                    <Link href={`/clients/${invoice.clientId}`} className="font-bold text-brand-primary hover:text-brand-hover hover:underline">
                      {invoice.client?.name || 'Unknown Client'}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-gray-500 font-medium border-y border-transparent group-hover:border-gray-100">
                    {new Date(invoice.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4 text-gray-500 font-medium border-y border-transparent group-hover:border-gray-100">
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-4 font-black text-gray-900 text-right border-y border-transparent group-hover:border-gray-100">
                    ${invoice.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-center border-y border-transparent group-hover:border-gray-100">
                    <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right rounded-r-xl border-y border-r border-transparent group-hover:border-gray-100">
                    <ActionDropdown actions={[
                      { label: 'View', icon: <Eye size={16} />, onClick: () => router.push(`/invoices/${invoice.id}`) },
                      { label: 'Edit', icon: <Edit size={16} />, onClick: () => router.push(`/invoices/${invoice.id}/edit`) },
                      { label: 'Duplicate', icon: <Copy size={16} />, onClick: async () => {
                        const res = await fetch(`/api/invoices/${invoice.id}/duplicate`, { method: 'POST' });
                        if (res.ok) { const data = await res.json(); toast.success('Invoice duplicated'); router.push(`/invoices/${data.invoice.id}`); }
                        else toast.error('Failed to duplicate');
                      }},
                      { label: 'Delete', icon: <Trash2 size={16} />, variant: 'danger', onClick: async () => {
                        if (!window.confirm(`Delete invoice ${invoice.number}?`)) return;
                        const res = await fetch(`/api/invoices/${invoice.id}`, { method: 'DELETE' });
                        if (res.ok) { toast.success('Invoice deleted'); setInvoices(invoices.filter((i: any) => i.id !== invoice.id)); }
                        else toast.error('Failed to delete invoice');
                      }}
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden p-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mr-3 align-middle"></div>Loading...
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <Search size={32} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No invoices found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
            </div>
          ) : invoices.map((invoice: any) => (
            <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="block bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-gray-900 text-sm">{invoice.number}</span>
                <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                  {invoice.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-700 truncate">{invoice.client?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Due {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-gray-900">${invoice.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
