import ClassicInvoicePDF from './pdf-templates/ClassicInvoicePDF';
import ModernInvoicePDF from './pdf-templates/ModernInvoicePDF';
import MinimalInvoicePDF from './pdf-templates/MinimalInvoicePDF';
import ProfessionalInvoicePDF from './pdf-templates/ProfessionalInvoicePDF';
import { getThemeColors } from '@/lib/themeColors';

export default function InvoicePDF({ invoice }: { invoice: any }) {
  if (!invoice) return null;
  const colors = getThemeColors(invoice.pdfTheme || 'CLASSIC', invoice.themeColors);

  switch (invoice.pdfTheme) {
    case 'MODERN':
      return <ModernInvoicePDF invoice={invoice} colors={colors} />;
    case 'MINIMAL':
      return <MinimalInvoicePDF invoice={invoice} colors={colors} />;
    case 'PROFESSIONAL':
      return <ProfessionalInvoicePDF invoice={invoice} colors={colors} />;
    case 'CLASSIC':
    default:
      return <ClassicInvoicePDF invoice={invoice} colors={colors} />;
  }
}
