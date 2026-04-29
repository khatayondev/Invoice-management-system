'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

export default function StripeCheckoutButton({ 
  invoiceId, 
  amount, 
  currency 
}: { 
  invoiceId: string; 
  amount: number; 
  currency: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initiate checkout.');
      }
    } catch (error) {
      console.error(error);
      alert('Error initiating checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="btn bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm disabled:opacity-50"
    >
      <CreditCard size={16} /> 
      {loading ? 'Processing...' : `Pay ${currency} ${amount.toFixed(2)}`}
    </button>
  );
}
