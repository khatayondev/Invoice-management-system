'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, User, Building, Mail, Eye, Edit, Trash2, Download, Upload, Users, Activity, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import ActionDropdown from '@/components/ActionDropdown';

const clientSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  clientCompany: z.string().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phone: z.string().optional(),
  billingAddress: z.string().optional(),
  taxId: z.string().optional()
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', clientCompany: '', email: '', phone: '', billingAddress: '', taxId: '' }
  });

  const fetchClients = async () => {
    setLoading(true);
    const res = await fetch(`/api/clients?search=${encodeURIComponent(search)}`);
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Client created successfully');
        setShowModal(false);
        reset();
        fetchClients();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create client');
      }
    } catch (error) {
      toast.error('An error occurred while creating the client');
    }
  };

  const exportToCSV = () => {
    if (!clients || clients.length === 0) {
      alert("No clients to export.");
      return;
    }
    const headers = ['Client Name', 'Company', 'Email', 'Phone', 'Total Invoices'];
    const rows = clients.map(client => [
      `"${client.name}"`,
      `"${client.clientCompany || ''}"`,
      client.email || '',
      client.phone || '',
      client._count?.invoices || '0'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clients_export.csv');
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
      alert(`File "${file.name}" selected for upload. Backend processing to be implemented.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Quick Stats Calculations
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c._count?.invoices > 0).length;
  const totalInvoicesGenerated = clients.reduce((sum, c) => sum + (c._count?.invoices || 0), 0);

  return (
    <div className="mt-2 md:mt-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Clients</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your clients and their billing details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv,.xlsx" 
            className="hidden" 
          />
          <button onClick={handleBulkUploadClick} className="btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm">
            <Upload size={18} /> Bulk Upload
          </button>
          <button onClick={exportToCSV} className="btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm">
            <Download size={18} /> Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 transition-transform">
            <Plus size={18} /> Add Client
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Total Clients</p>
              <h4 className="text-2xl font-black text-gray-900">{totalClients}</h4>
            </div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Active Clients</p>
              <h4 className="text-2xl font-black text-gray-900">{activeClients}</h4>
            </div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Total Invoices</p>
              <h4 className="text-2xl font-black text-gray-900">{totalInvoicesGenerated}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search clients by name, company or email..." 
              className="form-input pl-10 py-2.5 bg-white shadow-sm border-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto p-4">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Client</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Contact</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-center">Invoices</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-500 font-medium">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mr-3 align-middle"></div>
                  Loading clients...
                </td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 mb-4 shadow-inner">
                      <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No clients found</h3>
                    <p className="text-gray-500 font-medium">Try adjusting your search query.</p>
                </td></tr>
              ) : clients.map(client => (
                <tr key={client.id} className="bg-white hover:bg-gray-50 hover:shadow-md transition-all rounded-xl group cursor-pointer">
                  <td className="py-4 px-4 rounded-l-xl border-y border-l border-transparent group-hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-500 text-white flex items-center justify-center font-bold shadow-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-base">{client.name}</div>
                        {client.clientCompany && <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mt-0.5"><Building size={12} /> {client.clientCompany}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 border-y border-transparent group-hover:border-gray-100">
                    <div className="text-sm font-medium">
                      {client.email && <div className="flex items-center gap-1.5 text-gray-600 mb-1"><Mail size={14} className="text-gray-400"/> {client.email}</div>}
                      {client.phone && <div className="text-gray-500">{client.phone}</div>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center border-y border-transparent group-hover:border-gray-100">
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 border border-gray-200">
                      {client._count?.invoices || 0} Invoices
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right rounded-r-xl border-y border-r border-transparent group-hover:border-gray-100">
                    <ActionDropdown actions={[
                      { label: 'View', icon: <Eye size={16} />, onClick: () => router.push(`/clients/${client.id}`) },
                      { label: 'Edit', icon: <Edit size={16} />, onClick: () => router.push(`/clients/${client.id}`) },
                      { label: 'Delete', icon: <Trash2 size={16} />, variant: 'danger', onClick: async () => {
                        if (!window.confirm(`Delete client "${client.name}"?`)) return;
                        const res = await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
                        if (res.ok) { toast.success('Client deleted'); fetchClients(); }
                        else toast.error('Failed to delete client');
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
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Search size={32} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No clients found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search.</p>
            </div>
          ) : clients.map(client => (
            <Link key={client.id} href={`/clients/${client.id}`} className="block bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0 text-sm">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-sm truncate">{client.name}</div>
                    {client.clientCompany && <div className="text-xs text-gray-500 truncate">{client.clientCompany}</div>}
                    {client.email && <div className="text-xs text-gray-400 truncate mt-0.5">{client.email}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600">{client._count?.invoices || 0}</span>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!window.confirm(`Delete "${client.name}"?`)) return;
                      const res = await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
                      if (res.ok) { toast.success('Client deleted'); fetchClients(); }
                      else toast.error('Failed to delete');
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Add New Client</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-1 rounded-full shadow-sm border border-gray-100">&times;</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              <div>
                <label className="form-label">Contact Name *</label>
                <input {...register('name')} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-xs font-medium mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="form-label">Company Name</label>
                <input {...register('clientCompany')} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" {...register('email')} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="john@example.com" />
                  {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input {...register('phone')} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-gray-50">
                <button type="button" onClick={() => setShowModal(false)} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary disabled:opacity-50 hover:-translate-y-0.5 transition-transform shadow-md">
                  {isSubmitting ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
