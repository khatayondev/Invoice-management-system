'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Box, Edit, Trash2, Download, Upload, Package, Tag, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
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

  useEffect(() => { fetchProducts(); }, [search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', defaultPrice: '', unit: 'Unit' });
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      defaultPrice: product.defaultPrice.toString(),
      unit: product.unit
    });
    setShowModal(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', defaultPrice: '', unit: 'Unit' });
        fetchProducts();
      } else {
        toast.error('Failed to save product');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (product: any) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const exportToCSV = () => {
    if (!products.length) { toast.error("No products to export."); return; }
    const headers = ['Item Name', 'Description', 'Default Price', 'Unit'];
    const rows = products.map(p => [`"${p.name}"`, `"${p.description || ''}"`, p.defaultPrice.toString(), p.unit]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported');
  };

  const handleBulkUploadClick = () => { fileInputRef.current?.click(); };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info(`File "${file.name}" selected. Backend processing to be implemented.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const totalProducts = products.length;
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + p.defaultPrice, 0) / products.length : 0;
  const uniqueUnits = new Set(products.map(p => p.unit)).size;

  return (
    <div className="main-content">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">Products & Services</h2>
          <p className="text-gray-500 font-medium mt-1 text-sm">Manage your catalog of items to quickly add them to invoices.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.xlsx" className="hidden" />
          <button onClick={handleBulkUploadClick} className="btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm hidden sm:inline-flex">
            <Upload size={18} /> Bulk Upload
          </button>
          <button onClick={exportToCSV} className="btn bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm">
            <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button onClick={openCreateModal} className="btn btn-primary shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 transition-transform">
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body p-4 sm:p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Package size={20} /></div>
            <div><p className="text-sm font-bold text-gray-500 mb-1">Total Items</p><h4 className="text-2xl font-black text-gray-900">{totalProducts}</h4></div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="card-body p-4 sm:p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0"><Tag size={20} /></div>
            <div><p className="text-sm font-bold text-gray-500 mb-1">Average Price</p><h4 className="text-2xl font-black text-gray-900">${avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4></div>
          </div>
        </div>
        <div className="card mb-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body p-4 sm:p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Layers size={20} /></div>
            <div><p className="text-sm font-bold text-gray-500 mb-1">Unit Types</p><h4 className="text-2xl font-black text-gray-900">{uniqueUnits}</h4></div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search items by name..." className="form-input pl-10 py-2.5 bg-white shadow-sm border-gray-200" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto p-4">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Item Name</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Description</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Default Price</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-center">Unit</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500 font-medium">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mr-3 align-middle"></div>Loading catalog...
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 mb-4 shadow-inner"><Box size={32} /></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-500 font-medium">Try adjusting your search query or add a new item.</p>
                </td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="bg-white hover:bg-gray-50 hover:shadow-md transition-all rounded-xl group">
                  <td className="py-4 px-4 rounded-l-xl border-y border-l border-transparent group-hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl shadow-sm"><Box size={18} /></div>
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
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase tracking-wider border border-gray-200">{product.unit}</span>
                  </td>
                  <td className="py-4 px-4 text-right rounded-r-xl border-y border-r border-transparent group-hover:border-gray-100">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(product)} className="p-2 text-gray-400 hover:text-brand-primary bg-white rounded-lg hover:shadow-sm border border-transparent hover:border-gray-100 transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(product)} className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg hover:shadow-sm border border-transparent hover:border-gray-100 transition-all"><Trash2 size={16} /></button>
                    </div>
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
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Box size={32} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No items found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or add a new item.</p>
            </div>
          ) : products.map(product => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg shrink-0"><Box size={16} /></div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">${product.defaultPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} / {product.unit}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEditModal(product)} className="p-2 text-gray-400 hover:text-brand-primary rounded-lg transition-colors"><Edit size={16} /></button>
                <button onClick={() => handleDelete(product)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg sm:text-xl font-black text-gray-900">{editingProduct ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => { setShowModal(false); setEditingProduct(null); }} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-1 rounded-full shadow-sm border border-gray-100">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="form-label">Item Name *</label>
                <input required className="form-input py-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Web Design" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input py-3" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Default Price</label>
                  <input type="number" step="0.01" className="form-input py-3" value={formData.defaultPrice} onChange={e => setFormData({...formData, defaultPrice: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label className="form-label">Unit Type</label>
                  <select className="form-input py-3" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                    <option value="Unit">Unit</option>
                    <option value="Hour">Hour</option>
                    <option value="Item">Item</option>
                    <option value="Service">Service</option>
                    <option value="Day">Day</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-gray-50">
                <button type="button" onClick={() => { setShowModal(false); setEditingProduct(null); }} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="btn btn-primary shadow-md">{editingProduct ? 'Update Item' : 'Save Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
