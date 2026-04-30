import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Invo — Invoice Management Software for Freelancers & Businesses',
  description: 'Invo helps freelancers and businesses create professional invoices, automate payment reminders, and track payments in real time. Start free today.',
  keywords: 'invoice management software, online invoicing, get paid faster, freelance invoicing tool, automated payment reminders, invoice tracking dashboard',
};

export default function Home() {
  return <LandingPage />;
}
