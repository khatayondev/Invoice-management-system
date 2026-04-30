'use client';

import { useState, useEffect } from 'react';
import { Building, FileText, Mail, CreditCard, Users, CheckCircle2, ChevronRight, Save, Trash2, Plus } from 'lucide-react';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/lib/currencies';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [data, setData] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings/company')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setData({
      ...data,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (err) {
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>
  );

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building, desc: 'Basic info and contact details' },
    { id: 'invoices', label: 'Invoice Defaults', icon: FileText, desc: 'Currency, prefixes, and terms' },
    { id: 'email', label: 'Email (SMTP)', icon: Mail, desc: 'Configure custom email server' },
    { id: 'stripe', label: 'Payments (Stripe)', icon: CreditCard, desc: 'Accept credit card payments' },
    { id: 'team', label: 'Team Management', icon: Users, desc: 'Invite and manage users' },
  ];

  return (
    <div className="mt-2 md:mt-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Settings</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your company profile, invoice defaults, and app integrations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 shrink-0 space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMessage(''); }} 
                className={`w-full text-left px-4 py-4 rounded-2xl transition-all duration-200 flex items-center justify-between group border border-transparent ${
                  isActive 
                    ? 'bg-white shadow-lg border-gray-100' 
                    : 'hover:bg-white/60 hover:shadow-sm hover:border-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    isActive ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{tab.label}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">{tab.desc}</div>
                  </div>
                </div>
                {isActive && <ChevronRight size={16} className="text-gray-300" />}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 card mb-0 relative overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSave} className="flex flex-col h-full min-h-[500px]">
            
            <div className="p-8 flex-1">
              
              {/* Animated Success Message */}
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {message.includes('success') ? <CheckCircle2 size={18} /> : null}
                  {message}
                </div>
              )}

              {/* Tab Contents wrapped in animation key based on activeTab to trigger re-render animations */}
              <div key={activeTab} className="animate-fade-in">
                
                {activeTab === 'company' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">Company Information</h3>
                      <p className="text-sm text-gray-500 font-medium mb-6">This information will be displayed on your invoices.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <div className="md:col-span-2">
                          <label className="form-label">Company Name *</label>
                          <input name="name" value={data.name || ''} onChange={handleChange} required className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="Acme Corp" />
                        </div>
                        <div>
                          <label className="form-label">Tax ID / VAT Number</label>
                          <input name="taxId" value={data.taxId || ''} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="e.g. GB123456789" />
                        </div>
                        <div>
                          <label className="form-label">Contact Email</label>
                          <input name="email" value={data.email || ''} onChange={handleChange} type="email" className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="contact@company.com" />
                        </div>
                        <div>
                          <label className="form-label">Phone Number</label>
                          <input name="phone" value={data.phone || ''} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="+233 XX XXX XXXX" />
                        </div>
                        <div>
                          <label className="form-label">Website</label>
                          <input name="website" value={data.website || ''} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="https://company.com" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="form-label">Business Address</label>
                          <textarea name="address" value={data.address || ''} onChange={handleChange} rows={3} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder={"123 Business Rd\nCity, Region"} />
                        </div>
                      </div>
                    </div>

                    {/* Account Owner Info */}
                    {data.user && (
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">Account Owner</h3>
                        <p className="text-sm text-gray-500 font-medium mb-6">Your personal account details.</p>
                        
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-brand-primary/20">
                              {data.user.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">{data.user.name || 'Admin'}</div>
                              <div className="text-sm text-gray-500 font-medium">{data.user.role || 'ADMIN'}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                              <Mail size={18} className="text-gray-400 shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</div>
                                <div className="text-sm font-medium text-gray-900 truncate">{data.user.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                              <Building size={18} className="text-gray-400 shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Company</div>
                                <div className="text-sm font-medium text-gray-900 truncate">{data.name || 'Not set'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'invoices' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">Invoice Preferences</h3>
                      <p className="text-sm text-gray-500 font-medium mb-6">Configure how your invoices are generated by default.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <div>
                          <label className="form-label">Default Currency</label>
                          <select name="defaultCurrency" value={data.defaultCurrency || DEFAULT_CURRENCY} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors">
                            {CURRENCIES.map(c => (
                              <option key={c.code} value={c.code}>{c.code} ({c.symbol}) — {c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Default Tax Rate (%)</label>
                          <input name="defaultTaxRate" value={data.defaultTaxRate || 0} onChange={handleChange} type="number" step="0.01" className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="0.00" />
                        </div>
                        <div>
                          <label className="form-label">Invoice Prefix</label>
                          <input name="invoicePrefix" value={data.invoicePrefix || ''} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="INV-" />
                        </div>
                        <div>
                          <label className="form-label">Next Invoice Number</label>
                          <input name="invoiceStartNumber" value={data.invoiceStartNumber || 1} onChange={handleChange} type="number" className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="1001" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="form-label">Default Payment Instructions</label>
                          <textarea name="paymentInstructions" value={data.paymentInstructions || ''} onChange={handleChange} rows={3} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="Please send bank transfers to..." />
                          <p className="text-xs text-gray-400 font-medium mt-1.5">This text will be appended to the bottom of every new invoice.</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="form-label">Default Terms & Conditions</label>
                          <textarea name="defaultTerms" value={data.defaultTerms || ''} onChange={handleChange} rows={2} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="Net 30 days..." />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">SMTP Configuration</h3>
                      <p className="text-sm text-gray-500 font-medium mb-6">Configure your own email server to send invoices from your domain.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <div>
                          <label className="form-label">SMTP Host</label>
                          <input name="smtpHost" value={data.smtpHost || ''} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="smtp.gmail.com" />
                        </div>
                        <div>
                          <label className="form-label">SMTP Port</label>
                          <input name="smtpPort" value={data.smtpPort || ''} onChange={handleChange} type="number" className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="587" />
                        </div>
                        <div>
                          <label className="form-label">SMTP Username</label>
                          <input name="smtpUser" value={data.smtpUser || ''} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="billing@yourdomain.com" />
                        </div>
                        <div>
                          <label className="form-label">SMTP Password</label>
                          <input name="smtpPass" value={data.smtpPass || ''} onChange={handleChange} type="password" className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="••••••••••••" />
                          <p className="text-xs text-gray-400 font-medium mt-1.5">Leave blank to keep your current password.</p>
                        </div>
                        <div className="md:col-span-2 border-t border-gray-200/60 my-2"></div>
                        <div>
                          <label className="form-label">From Name</label>
                          <input name="smtpFromName" value={data.smtpFromName || ''} onChange={handleChange} className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="Acme Billing" />
                        </div>
                        <div>
                          <label className="form-label">From Email Address</label>
                          <input name="smtpFromEmail" value={data.smtpFromEmail || ''} onChange={handleChange} type="email" className="form-input py-3 hover:border-gray-300 transition-colors" placeholder="billing@acme.com" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'stripe' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">Stripe Integration</h3>
                      <p className="text-sm text-gray-500 font-medium mb-6">Connect your Stripe account to allow clients to pay invoices directly via Credit Card.</p>
                      
                      <div className="grid grid-cols-1 gap-6 bg-[#635BFF]/5 p-6 rounded-2xl border border-[#635BFF]/20">
                        <div>
                          <label className="form-label text-[#635BFF]">Stripe Secret Key</label>
                          <input name="stripeSecretKey" value={data.stripeSecretKey || ''} onChange={handleChange} type="password" className="form-input py-3 focus:ring-[#635BFF] border-[#635BFF]/30 transition-colors bg-white" placeholder="sk_test_..." />
                        </div>
                        <div>
                          <label className="form-label text-[#635BFF]">Stripe Webhook Secret</label>
                          <input name="stripeWebhookSecret" value={data.stripeWebhookSecret || ''} onChange={handleChange} type="password" className="form-input py-3 focus:ring-[#635BFF] border-[#635BFF]/30 transition-colors bg-white" placeholder="whsec_..." />
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#635BFF]/20">
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Webhook Setup Details</p>
                          <p className="text-sm text-gray-600 mb-1">URL: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/stripe/{data.id}</code></p>
                          <p className="text-sm text-gray-600">Events: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">checkout.session.completed</code></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">Team Management</h3>
                        <p className="text-sm text-gray-500 font-medium">Manage users and their access levels within your company.</p>
                      </div>
                      <button type="button" onClick={() => {
                        const email = prompt('Enter email to invite:');
                        if (!email) return;
                        const name = prompt('Enter full name:');
                        const role = prompt('Enter role (ADMIN, ACCOUNTANT, VIEWER):', 'VIEWER');
                        
                        fetch('/api/settings/team', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, name, role })
                        }).then(res => res.json()).then(data => {
                          if (data.error) alert(data.error);
                          else {
                            alert(`User added! Temporary password: ${data.tempPassword}`);
                            window.location.reload();
                          }
                        });
                      }} className="btn btn-primary shadow-md hover:-translate-y-0.5 transition-transform mt-4 sm:mt-0 flex items-center gap-2">
                        <Plus size={16} /> Invite User
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <TeamList />
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Sticky Save Footer (Hide for Team tab as it doesn't use the form) */}
            {activeTab !== 'team' && (
              <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-6 flex justify-end z-10">
                <button type="submit" disabled={saving} className="btn btn-primary px-8 shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:transform-none">
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            )}
            
          </form>
        </div>
      </div>
    </div>
  );
}

function TeamList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/team').then(res => res.json()).then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    fetch(`/api/settings/team?id=${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
      });
  };

  if (loading) return (
    <div className="text-center py-12 text-gray-500 font-medium border border-gray-100 rounded-2xl bg-gray-50/50">
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mr-3 align-middle"></div>
      Loading team...
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50/80 text-gray-500">
          <tr>
            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">User</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Email</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Role</th>
            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-900">{u.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-600">{u.email}</td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                  u.role === 'ACCOUNTANT' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button type="button" onClick={() => handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-12 text-gray-500 font-medium">No team members found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
