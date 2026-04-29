'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building, Mail, Phone, MapPin, Edit, FileText } from 'lucide-react';

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then(res => res.json())
      .then(data => {
        setClient(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading client details...</div>;
  if (!client || client.error) return <div className="p-8 text-red-500">Client not found</div>;

  return (
    <div className="main-content">
      <div className="mb-6">
        <Link href="/clients" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Clients
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{client.name}</h2>
            {client.clientCompany && (
              <p className="text-lg text-gray-500 flex items-center gap-2 mt-1">
                <Building size={16} /> {client.clientCompany}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-dashed">
            <Edit size={16} /> Edit Client
          </button>
          <Link href={`/invoices/new?client=${client.id}`} className="btn btn-primary">
            <FileText size={16} /> New Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="card col-span-1 mb-0">
          <div className="card-body">
            <h3 className="text-lg font-bold border-b pb-3 mb-4">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Mail className="text-gray-400 mt-0.5 shrink-0" size={16} />
                <div className="overflow-hidden break-words text-gray-700">{client.email || 'No email provided'}</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="text-gray-400 mt-0.5 shrink-0" size={16} />
                <div className="text-gray-700">{client.phone || 'No phone provided'}</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="text-gray-400 mt-0.5 shrink-0" size={16} />
                <div className="text-gray-700 whitespace-pre-wrap">{client.billingAddress || 'No address provided'}</div>
              </div>
              
              {client.taxId && (
                <div className="pt-4 border-t mt-4">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">Tax ID</div>
                  <div className="text-sm font-medium">{client.taxId}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card col-span-2 mb-0">
          <div className="card-body">
            <h3 className="text-lg font-bold border-b pb-3 mb-4">Recent Invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500 border-b">
                    <th className="pb-3 font-semibold">Invoice</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {client.invoices.length === 0 ? (
                    <tr><td colSpan={4} className="py-6 text-center text-gray-500">No invoices found for this client.</td></tr>
                  ) : client.invoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="py-3 font-medium text-brand-primary">
                        <Link href={`/invoices/${inv.id}`}>{inv.number}</Link>
                      </td>
                      <td className="py-3 text-gray-600">{new Date(inv.issueDate).toLocaleDateString()}</td>
                      <td className="py-3 font-semibold">${inv.grandTotal.toFixed(2)}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded text-gray-600">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
