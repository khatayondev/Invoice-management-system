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
    page: { padding: 50, fontFamily: 'Inter', fontSize: 10, color: '#374151', backgroundColor: c.bgColor },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    title: { fontSize: 28, fontWeight: 700, color: c.primaryColor, letterSpacing: 2, marginBottom: 10 },
    invoiceInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    sectionTitle: { fontSize: 10, fontWeight: 700, color: c.secondaryColor, textTransform: 'uppercase', marginBottom: 5 },
    boldText: { fontWeight: 700, color: c.primaryColor },
    table: { width: '100%', marginTop: 20, marginBottom: 30 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: c.secondaryColor, paddingBottom: 8, marginBottom: 8 },
    tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    col1: { width: '5%', textAlign: 'left' },
    col2: { width: '45%', textAlign: 'left' },
    col3: { width: '15%', textAlign: 'center' },
    col4: { width: '15%', textAlign: 'right' },
    col5: { width: '20%', textAlign: 'right' },
    totalsContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    totalsBox: { width: '40%' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 4, borderTopWidth: 2, borderTopColor: c.primaryColor },
    grandTotalText: { fontSize: 14, fontWeight: 700, color: c.primaryColor },
    footer: { position: 'absolute', bottom: 50, left: 50, right: 50, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' }
  });
}

export default function ClassicInvoicePDF({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const s = createStyles(colors);
  const balanceDue = Math.max(0, invoice.grandTotal - invoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0));

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.title}>INVOICE</Text>
            <Text style={s.boldText}>{invoice.number}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={[s.boldText, { fontSize: 14, marginBottom: 4 }]}>{invoice.company?.name || 'Your Company'}</Text>
            <Text>{invoice.company?.address}</Text>
            <Text>{invoice.company?.email}</Text>
            <Text>{invoice.company?.phone}</Text>
          </View>
        </View>

        <View style={s.invoiceInfo}>
          <View>
            <Text style={s.sectionTitle}>Billed To</Text>
            <Text style={[s.boldText, { fontSize: 12, marginBottom: 2 }]}>{invoice.client?.name}</Text>
            {!!invoice.client?.clientCompany && <Text style={{ marginBottom: 2 }}>{invoice.client.clientCompany}</Text>}
            <Text>{invoice.client?.billingAddress}</Text>
            {!!invoice.client?.email && <Text style={{ marginTop: 2 }}>{invoice.client.email}</Text>}
          </View>
          <View style={{ textAlign: 'right' }}>
            <View style={{ flexDirection: 'row', marginBottom: 4, justifyContent: 'flex-end' }}>
              <Text style={s.sectionTitle}>Issue Date: </Text>
              <Text style={{ width: 80, textAlign: 'right' }}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4, justifyContent: 'flex-end' }}>
              <Text style={s.sectionTitle}>Due Date: </Text>
              <Text style={{ width: 80, textAlign: 'right' }}>{new Date(invoice.dueDate).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <Text style={[s.boldText, { padding: 4, backgroundColor: '#F3F4F6', borderRadius: 4 }]}>
                {invoice.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={s.col1}>#</Text>
            <Text style={s.col2}>Description</Text>
            <Text style={s.col3}>Qty</Text>
            <Text style={s.col4}>Price</Text>
            <Text style={s.col5}>Total</Text>
          </View>
          {invoice.lineItems?.map((item: any, i: number) => (
            <View key={item.id || i} style={s.tableRow}>
              <Text style={s.col1}>{i + 1}</Text>
              <Text style={[s.col2, s.boldText]}>{item.description}</Text>
              <Text style={s.col3}>{item.quantity}</Text>
              <Text style={s.col4}>{invoice.currency} {item.unitPrice.toFixed(2)}</Text>
              <Text style={[s.col5, s.boldText]}>{invoice.currency} {item.lineTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totalsContainer}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text>Subtotal</Text>
              <Text>{invoice.currency} {invoice.subtotal.toFixed(2)}</Text>
            </View>
            {invoice.discountAmount > 0 && (
              <View style={s.totalRow}>
                <Text>Discount</Text>
                <Text>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</Text>
              </View>
            )}
            <View style={s.totalRow}>
              <Text>Tax</Text>
              <Text>{invoice.currency} {invoice.taxTotal.toFixed(2)}</Text>
            </View>
            <View style={s.grandTotalRow}>
              <Text style={s.grandTotalText}>Total Due</Text>
              <Text style={s.grandTotalText}>{invoice.currency} {balanceDue.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
          {!!invoice.paymentInstructions && (
            <View style={{ width: '45%' }}>
              <Text style={s.sectionTitle}>Payment Instructions</Text>
              <Text style={{ lineHeight: 1.5 }}>{invoice.paymentInstructions}</Text>
            </View>
          )}
          {!!invoice.terms && (
            <View style={{ width: '45%' }}>
              <Text style={s.sectionTitle}>Terms & Conditions</Text>
              <Text style={{ lineHeight: 1.5 }}>{invoice.terms}</Text>
            </View>
          )}
        </View>

        <View style={s.footer}>
          <Text>Thank you for your business!</Text>
          <Text>{invoice.company?.website || invoice.company?.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
