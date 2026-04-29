'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Box, Edit, Trash2, Download, Upload, MoreHorizontal, Package, Tag, Layers } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', defaultPrice: '', unit: 'Unit'
  });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`/api/products?search=${encodeURIComponent(search)}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowModal(false);
      setFormData({ name: '', description: '', defaultPrice: '', unit: 'Unit' });
      fetchProducts();
    }
  };

  const exportToCSV = () => {
    if (!products || products.length === 0) {
      alert("No products to export.");
      return;
    }
    const headers = ['Item Name', 'Description', 'Default Price', 'Unit'];
    const rows = products.map(p => [
      `"${p.name}"`,
      `"${p.description || ''}"`,
      p.defaultPrice.toString(),
      p.unit
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products_export.csv');
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

  // Quick Stats
  const totalProducts = products.length;
  const avgPrice = products.length > 0 
    ? products.reduce((sum, p) => sum + p.defaultPrice, 0) / products.length 
    : 0;
  const uniqueUnits = new Set(products.map(p => p.unit)).size;

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Products & Services</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your catalog of items to quickly add them to invoices.</p>
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
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Total Items</p>
              <h4 className="text-2xl font-black text-gray-900">{totalProducts}</h4>
            </div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Average Price</p>
              <h4 className="text-2xl font-black text-gray-900">${avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
            </div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Unit Types</p>
              <h4 className="text-2xl font-black text-gray-900">{uniqueUnits}</h4>
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
              placeholder="Search items by name..." 
              className="form-input pl-10 py-2.5 bg-white shadow-sm border-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-3 px-4 font-semibold w-10">
                  <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary border-gray-300" />
                </th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Item Name</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Description</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Default Price</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-center">Unit</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500 font-medium">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mr-3 align-middle"></div>
                  Loading catalog...
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 mb-4 shadow-inner">
                      <Box size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-500 font-medium">Try adjusting your search query or add a new item.</p>
                </td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="bg-white hover:bg-gray-50 hover:shadow-md transition-all rounded-xl group cursor-pointer">
                  <td className="py-4 px-4 rounded-l-xl border-y border-l border-transparent group-hover:border-gray-100">
                    <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary border-gray-300" />
                  </td>
                  <td className="py-4 px-4 border-y border-transparent group-hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl shadow-sm">
                        <Box size={18} />
                      </div>
                      <span className="font-bold text-gray-900 text-base">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 border-y border-transparent group-hover:border-gray-100">
                    <div className="text-sm text-gray-600 max-w-xs truncate font-medium">{product.description || '-'}</div>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-gray-900 border-y border-transparent group-hover:border-gray-100">
                    ${product.defaultPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-center border-y border-transparent group-hover:border-gray-100">
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase tracking-wider border border-gray-200">
                      {product.unit}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right rounded-r-xl border-y border-r border-transparent group-hover:border-gray-100">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-brand-primary bg-white rounded-lg hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Add New Item</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-1 rounded-full shadow-sm border border-gray-100">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-5">
              <div>
                <label className="form-label">Item Name *</label>
                <input required className="form-input py-3 hover:border-gray-300 transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Web Design" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input py-3 hover:border-gray-300 transition-colors" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description of the service or item" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Default Price</label>
                  <input type="number" step="0.01" className="form-input py-3 hover:border-gray-300 transition-colors" value={formData.defaultPrice} onChange={e => setFormData({...formData, defaultPrice: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label className="form-label">Unit Type</label>
                  <select className="form-input py-3 hover:border-gray-300 transition-colors" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                    <option value="Unit">Unit</option>
                    <option value="Hour">Hour</option>
                    <option value="Item">Item</option>
                    <option value="Service">Service</option>
                    <option value="Day">Day</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-gray-50">
                <button type="button" onClick={() => setShowModal(false)} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="btn btn-primary hover:-translate-y-0.5 transition-transform shadow-md">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
