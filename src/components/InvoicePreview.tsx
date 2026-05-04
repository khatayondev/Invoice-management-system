import ClassicInvoicePreview from './preview-templates/ClassicInvoicePreview';
import ModernInvoicePreview from './preview-templates/ModernInvoicePreview';
import MinimalInvoicePreview from './preview-templates/MinimalInvoicePreview';
import ProfessionalInvoicePreview from './preview-templates/ProfessionalInvoicePreview';
import { getThemeColors } from '@/lib/themeColors';

export default function InvoicePreview({ invoice }: { invoice: any }) {
  if (!invoice) return null;
  const colors = getThemeColors(invoice.pdfTheme || 'CLASSIC', invoice.themeColors);

  switch (invoice.pdfTheme) {
    case 'MODERN':
      return <ModernInvoicePreview invoice={invoice} colors={colors} />;
    case 'MINIMAL':
      return <MinimalInvoicePreview invoice={invoice} colors={colors} />;
    case 'PROFESSIONAL':
      return <ProfessionalInvoicePreview invoice={invoice} colors={colors} />;
    case 'CLASSIC':
    default:
      return <ClassicInvoicePreview invoice={invoice} colors={colors} />;
  }
}
