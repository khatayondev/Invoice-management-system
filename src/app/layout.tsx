import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Invoice Management System',
  description: 'Full-stack invoicing system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
