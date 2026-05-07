import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { ThemeColors } from '@/lib/themeColors';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf', fontWeight: 700 }
  ]
});

function createStyles(c: ThemeColors) {
  return StyleSheet.create({
    page: {
      padding: 50,
      fontFamily: 'Inter',
      fontSize: 10,
      color: '#222222',
      backgroundColor: c.bgColor,
    },
    /* ── Header ── */
    headerBlock: {
      alignItems: 'center',
      marginBottom: 6,
    },
    companyName: {
      fontSize: 18,
      fontWeight: 700,
      color: c.primaryColor,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    companyAddress: {
      fontSize: 9,
      color: c.secondaryColor,
      textAlign: 'center',
      marginTop: 4,
    },
    headerDivider: {
      borderBottomWidth: 1,
      borderBottomColor: c.primaryColor,
      marginTop: 10,
      marginBottom: 18,
    },

    /* ── Invoice Label Row ── */
    invoiceLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 18,
    },
    invoiceLabelBox: {
      borderWidth: 2,
      borderColor: c.primaryColor,
      paddingVertical: 6,
      paddingHorizontal: 14,
    },
    invoiceLabelText: {
      fontSize: 12,
      fontWeight: 700,
      color: c.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    invoiceInfoBlock: {
      textAlign: 'right',
    },
    invoiceInfoLine: {
      fontSize: 10,
      color: '#444',
      marginBottom: 2,
    },
    invoiceInfoBold: {
      fontWeight: 700,
      color: c.primaryColor,
    },

    /* ── Consignee ── */
    consigneeBlock: {
      marginBottom: 24,
    },
    consigneeLabel: {
      fontSize: 9,
      fontWeight: 700,
      color: c.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    consigneeText: {
      fontSize: 10,
      color: '#333',
      lineHeight: 1.6,
    },

    /* ── Table ── */
    table: {
      width: '100%',
      marginBottom: 4,
      borderWidth: 1,
      borderColor: '#333',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: c.primaryColor,
      paddingVertical: 9,
      paddingHorizontal: 10,
    },
    th: {
      fontSize: 9,
      fontWeight: 700,
      color: '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    tableRowAlt: {
      backgroundColor: '#FAFAFA',
    },
    col1: { width: '38%', textAlign: 'left' },
    col2: { width: '20%', textAlign: 'center' },
    col3: { width: '18%', textAlign: 'center' },
    col4: { width: '24%', textAlign: 'right' },

    /* ── Total Row inside table ── */
    totalRowInTable: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderTopWidth: 2,
      borderTopColor: c.primaryColor,
    },
    totalLabel: {
      fontSize: 12,
      fontWeight: 700,
      color: c.primaryColor,
      textAlign: 'right',
      width: '76%',
    },
    totalValue: {
      fontSize: 12,
      fontWeight: 700,
      color: c.primaryColor,
      textAlign: 'right',
      width: '24%',
    },

    /* ── Terms / Total-in-words ── */
    termsBlock: {
      marginTop: 16,
      marginBottom: 16,
    },
    termsLine: {
      fontSize: 9,
      fontWeight: 700,
      color: c.primaryColor,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      marginBottom: 3,
    },
    termsValue: {
      fontSize: 9,
      color: '#444',
      marginBottom: 6,
    },

    /* ── Bank Information ── */
    bankBlock: {
      marginTop: 8,
    },
    bankTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: c.primaryColor,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    bankRow: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    bankLabel: {
      fontSize: 9,
      fontWeight: 700,
      color: c.primaryColor,
      width: 120,
      textTransform: 'uppercase',
    },
    bankValue: {
      fontSize: 9,
      color: '#333',
      flex: 1,
      textTransform: 'uppercase',
    },

    /* ── Footer ── */
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 50,
      right: 50,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerText: {
      fontSize: 8,
      color: '#999',
    },
  });
}

/** Convert a number to words (simple version) */
function numberToWords(num: number): string {
  if (num === 0) return 'ZERO';

  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
    'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 ? ' AND ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' THOUSAND' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    return convert(Math.floor(n / 1000000)) + ' MILLION' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
  };

  return convert(Math.floor(num));
}

export default function Special1InvoicePDF({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const s = createStyles(colors);
  const balanceDue = Math.max(0, invoice.grandTotal - invoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0));

  const formatDate = (d: string) => {
    const date = new Date(d);
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    return `${day}${suffix} ${date.toLocaleDateString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
  };

  // Parse payment instructions into bank info key-value pairs
  const parseBankInfo = (instructions: string | undefined) => {
    if (!instructions) return [];
    return instructions.split('\n').filter(Boolean).map(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > -1) {
        return { label: line.substring(0, colonIdx + 1).trim(), value: line.substring(colonIdx + 1).trim() };
      }
      return { label: '', value: line.trim() };
    });
  };

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Company Header ── */}
        <View style={s.headerBlock}>
          <Text style={s.companyName}>{invoice.company?.name || 'Your Company'}</Text>
          <Text style={s.companyAddress}>{invoice.company?.address}</Text>
        </View>
        <View style={s.headerDivider} />

        {/* ── Invoice Label + Number ── */}
        <View style={s.invoiceLabelRow}>
          <View style={s.invoiceLabelBox}>
            <Text style={s.invoiceLabelText}>Proforma Invoice</Text>
          </View>
          <View style={s.invoiceInfoBlock}>
            <Text style={s.invoiceInfoLine}>
              INVOICE NO: <Text style={s.invoiceInfoBold}>{invoice.number}</Text>
            </Text>
            <Text style={s.invoiceInfoLine}>
              INVOICE DATE: {formatDate(invoice.issueDate)}
            </Text>
            <Text style={s.invoiceInfoLine}>
              DUE DATE: {formatDate(invoice.dueDate)}
            </Text>
          </View>
        </View>

        {/* ── Consignee ── */}
        <View style={s.consigneeBlock}>
          <Text style={s.consigneeLabel}>Consignee To :</Text>
          <Text style={s.consigneeText}>{invoice.client?.name}</Text>
          {!!invoice.client?.clientCompany && (
            <Text style={s.consigneeText}>{invoice.client.clientCompany}</Text>
          )}
          {!!invoice.client?.billingAddress && (
            <Text style={s.consigneeText}>{invoice.client.billingAddress}</Text>
          )}
          {!!invoice.client?.email && (
            <Text style={[s.consigneeText, { marginTop: 2 }]}>{invoice.client.email}</Text>
          )}
        </View>

        {/* ── Items Table ── */}
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.col1, s.th]}>Description of Goods</Text>
            <Text style={[s.col2, s.th]}>Unit Price</Text>
            <Text style={[s.col3, s.th]}>Qty/Pcs</Text>
            <Text style={[s.col4, s.th]}>Amount</Text>
          </View>
          {invoice.lineItems?.map((item: any, i: number) => (
            <View key={item.id || i} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
              <Text style={[s.col1, { fontWeight: 400 }]}>{item.description}</Text>
              <Text style={[s.col2, { color: '#555' }]}>{invoice.currency} {item.unitPrice.toFixed(2)}</Text>
              <Text style={[s.col3, { color: '#555' }]}>{item.quantity}</Text>
              <Text style={[s.col4, { fontWeight: 700 }]}>{invoice.currency} {item.lineTotal.toFixed(2)}</Text>
            </View>
          ))}

          {/* Subtotal / Tax rows if applicable */}
          {(invoice.discountAmount > 0 || invoice.taxTotal > 0) && (
            <>
              <View style={[s.tableRow, { borderBottomWidth: 0 }]}>
                <Text style={[s.col1]}></Text>
                <Text style={[s.col2]}></Text>
                <Text style={[s.col3, { fontWeight: 700, textAlign: 'right' }]}>Subtotal:</Text>
                <Text style={[s.col4, { fontWeight: 700 }]}>{invoice.currency} {invoice.subtotal.toFixed(2)}</Text>
              </View>
              {invoice.discountAmount > 0 && (
                <View style={[s.tableRow, { borderBottomWidth: 0 }]}>
                  <Text style={[s.col1]}></Text>
                  <Text style={[s.col2]}></Text>
                  <Text style={[s.col3, { fontWeight: 700, textAlign: 'right' }]}>Discount:</Text>
                  <Text style={[s.col4, { fontWeight: 700 }]}>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</Text>
                </View>
              )}
              {invoice.taxTotal > 0 && (
                <View style={[s.tableRow, { borderBottomWidth: 0 }]}>
                  <Text style={[s.col1]}></Text>
                  <Text style={[s.col2]}></Text>
                  <Text style={[s.col3, { fontWeight: 700, textAlign: 'right' }]}>Tax:</Text>
                  <Text style={[s.col4, { fontWeight: 700 }]}>{invoice.currency} {invoice.taxTotal.toFixed(2)}</Text>
                </View>
              )}
            </>
          )}

          {/* Grand Total */}
          <View style={s.totalRowInTable}>
            <Text style={s.totalLabel}>Total: {invoice.currency} </Text>
            <Text style={s.totalValue}>{balanceDue.toFixed(2)}</Text>
          </View>
        </View>

        {/* ── Terms / Total in Words ── */}
        <View style={s.termsBlock}>
          {!!invoice.terms && (
            <>
              <Text style={s.termsLine}>Terms of Payment:</Text>
              <Text style={s.termsValue}>{invoice.terms}</Text>
            </>
          )}
          <Text style={s.termsLine}>Total in Words:</Text>
          <Text style={s.termsValue}>
            {numberToWords(Math.floor(balanceDue))} {invoice.currency}
          </Text>
        </View>

        {/* ── Bank Information ── */}
        {!!invoice.paymentInstructions && (
          <View style={s.bankBlock}>
            <Text style={s.bankTitle}>Bank Information</Text>
            {parseBankInfo(invoice.paymentInstructions).map((row, i) => (
              <View key={i} style={s.bankRow}>
                {row.label ? (
                  <>
                    <Text style={s.bankLabel}>{row.label}</Text>
                    <Text style={s.bankValue}>{row.value}</Text>
                  </>
                ) : (
                  <Text style={s.bankValue}>{row.value}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerText}>Thank you for your business!</Text>
          <Text style={s.footerText}>{invoice.company?.website || invoice.company?.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
