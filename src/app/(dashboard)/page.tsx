'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, Activity, FileText, Users, Heart, Download, LogOut, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyChartData = [
  { name: 'Mar', value: 8000 },
  { name: 'Apr', value: 12000 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 15000 },
  { name: 'Jul', value: 10000 },
  { name: 'Aug', value: 9000 },
  { name: 'Sep', value: 11000 },
  { name: 'Oct', value: 13000 },
  { name: 'Nov', value: 12000 },
];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>
  );
  
  if (!data || data.error) return <div className="p-8 text-red-500">Failed to load dashboard</div>;

  const { summary, recentInvoices, recentActivity } = data;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 text-gray-900 text-sm font-bold py-3 px-4 rounded-xl shadow-xl">
          <div className="text-gray-400 text-xs font-normal mb-1">Revenue</div>
          ${payload[0].value.toLocaleString()}
        </div>
      );
    }
    return null;
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    window.location.href = '/login';
  };

  return (
    <div className="main-content">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-10 animate-fade-in">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{greeting}, Admin!</h1>
          <p className="text-gray-500 mt-1 font-medium">Here is what's happening with your business today.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-72 bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-700 shadow-[0_4px_24px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all hover:bg-white"
            />
          </div>

          <div className="relative cursor-pointer bg-white shadow-sm p-3 rounded-full hover:shadow-md transition-all">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          
          {/* Profile Dropdown Container */}
          <div className="relative">
            <div 
              className="flex items-center gap-3 cursor-pointer bg-white p-1.5 pr-4 rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
                A
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-bold text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">Sales Admin</div>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-sm text-gray-900 font-bold">Admin User</p>
                  <p className="text-xs text-gray-500 font-medium">demo@example.com</p>
                </div>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => { setShowProfileMenu(false); alert('Help center coming soon!'); }}
                >
                  <HelpCircle size={18} className="text-gray-400" />
                  Help & Support
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Row: Floating Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Revenue Card */}
        <div className="card mb-0 hover:-translate-y-1 transition-transform duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                <Activity size={20} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-lg">
                <ArrowUpRight size={14} /> 34%
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-900">${(summary.totalRevenue / 1000).toFixed(0)}k</h3>
            </div>
          </div>
        </div>

        {/* Invoices Card */}
        <div className="card mb-0 hover:-translate-y-1 transition-transform duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                <FileText size={20} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-lg">
                <ArrowUpRight size={14} /> 12%
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Total Invoices</p>
              <h3 className="text-3xl font-black text-gray-900">{summary.invoicesCount.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Clients Card */}
        <div className="card mb-0 hover:-translate-y-1 transition-transform duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Users size={20} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-lg">
                <ArrowUpRight size={14} /> 9%
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Active Clients</p>
              <h3 className="text-3xl font-black text-gray-900">{summary.clientsCount.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Loyalty Card */}
        <div className="card mb-0 hover:-translate-y-1 transition-transform duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                <Heart size={20} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">
                <ArrowDownRight size={14} /> 1%
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Client Retention</p>
              <h3 className="text-3xl font-black text-gray-900">78%</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Premium Area Chart */}
        <div className="lg:col-span-2 card mb-0 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="card-body p-8 h-full flex flex-col">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h3 className="text-gray-500 font-medium mb-1 text-lg">Revenue Overview</h3>
                <div className="text-4xl font-black text-gray-900">$15,000<span className="text-base text-gray-400 font-medium ml-2">/ this month</span></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-brand-primary"></div> Revenue
                </div>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4318FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4318FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EDF7" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A3AED0', fontSize: 13, fontWeight: 500 }} 
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4318FF', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4318FF" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    activeDot={{ r: 8, fill: '#4318FF', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dynamic Promo Card */}
        <div className="lg:col-span-1 rounded-[24px] bg-gradient-to-br from-brand-primary to-[#00D1FF] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-brand-primary/20 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          {/* Animated Background Blobs */}
          <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -left-16 -top-16 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">New Feature</span>
            <h3 className="text-3xl font-black mb-4 leading-tight">Smart Invoice Templates</h3>
            <p className="text-white/80 text-base leading-relaxed font-medium">
              Stand out to your clients with our newly designed, conversion-optimized templates.
            </p>
          </div>
          
          <button className="relative z-10 w-full bg-white text-brand-primary py-4 rounded-xl font-bold text-base mt-8 shadow-lg hover:scale-[1.02] transition-transform duration-200">
            Explore Templates
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activities */}
        <div className="lg:col-span-1 card mb-0 animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="card-body p-8">
            <h3 className="font-black text-xl text-gray-900 mb-8">Recent Activity</h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.25rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-100 before:via-gray-200 before:to-transparent">
              
              {recentActivity && recentActivity.length > 0 ? recentActivity.map((activity: any) => (
                <div key={activity.id} className="relative flex items-start gap-4 group cursor-pointer">
                  {activity.type === 'INVOICE_CREATED' ? (
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <FileText size={16} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all">
                      <Activity size={16} />
                    </div>
                  )}
                  <div className="bg-gray-50/50 p-3 rounded-xl border border-transparent group-hover:border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all flex-1">
                    <p className="text-sm text-gray-900 font-bold mb-0.5">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{activity.description}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500 text-center py-4 bg-white z-10 relative">No recent activity.</div>
              )}
              
            </div>
          </div>
        </div>

        {/* Recent Invoices Table */}
        <div className="lg:col-span-2 card mb-0 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="card-body p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xl text-gray-900">Recent Invoices</h3>
              <button className="text-sm font-bold text-brand-primary hover:text-brand-hover transition-colors">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-gray-400">
                    <th className="pb-2 font-semibold px-4">Invoice ID</th>
                    <th className="pb-2 font-semibold px-4">Date</th>
                    <th className="pb-2 font-semibold px-4">Client</th>
                    <th className="pb-2 font-semibold px-4 text-right">Amount</th>
                    <th className="pb-2 font-semibold px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv: any) => (
                    <tr key={inv.id} className="bg-gray-50/50 hover:bg-white hover:shadow-md transition-all rounded-xl group cursor-pointer">
                      <td className="py-4 px-4 font-bold text-gray-900 rounded-l-xl border-y border-l border-transparent group-hover:border-gray-100">{inv.number}</td>
                      <td className="py-4 px-4 text-gray-500 font-medium border-y border-transparent group-hover:border-gray-100">{new Date(inv.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-4 font-bold text-gray-700 border-y border-transparent group-hover:border-gray-100">{inv.client?.name || 'Unknown'}</td>
                      <td className="py-4 px-4 font-black text-gray-900 text-right border-y border-transparent group-hover:border-gray-100">${inv.grandTotal.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center rounded-r-xl border-y border-r border-transparent group-hover:border-gray-100">
                        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                          inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                          inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                          'bg-gray-200 text-gray-700'
                        }`}>
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
