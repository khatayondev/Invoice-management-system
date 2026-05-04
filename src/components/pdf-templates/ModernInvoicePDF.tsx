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
    page: { padding: 0, fontFamily: 'Inter', fontSize: 10, color: '#333', backgroundColor: c.bgColor },
    sidebar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 12, backgroundColor: c.primaryColor },
    content: { paddingTop: 40, paddingBottom: 40, paddingLeft: 52, paddingRight: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#F3F4F6', paddingBottom: 20, marginBottom: 30 },
    title: { fontSize: 22, fontWeight: 700, color: c.primaryColor, letterSpacing: 1 },
    invoiceNum: { fontSize: 11, color: c.secondaryColor, marginTop: 4 },
    companyName: { fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 3, textAlign: 'right' },
    companyDetail: { fontSize: 9, color: '#666', textAlign: 'right' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    infoBox: { width: '48%', backgroundColor: '#F9FAFB', padding: 15, borderRadius: 6 },
    label: { fontSize: 8, fontWeight: 700, color: c.secondaryColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    clientName: { fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 2 },
    table: { width: '100%', marginBottom: 30 },
    tableHeader: { flexDirection: 'row', backgroundColor: c.primaryColor, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 4 },
    th: { fontSize: 9, fontWeight: 700, color: '#FFFFFF' },
    tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    col1: { width: '5%', textAlign: 'left' },
    col2: { width: '45%', textAlign: 'left' },
    col3: { width: '15%', textAlign: 'center' },
    col4: { width: '15%', textAlign: 'right' },
    col5: { width: '20%', textAlign: 'right' },
    totalsContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    totalsBox: { width: '50%' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginTop: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 12, borderRadius: 6 },
    grandTotalText: { fontSize: 13, fontWeight: 700, color: c.primaryColor },
    notesRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    noteBlock: { width: '48%' },
    noteText: { fontSize: 9, color: '#666', lineHeight: 1.5 },
    footerText: { textAlign: 'center', marginTop: 40, fontSize: 8, color: '#999' },
  });
}

export default function ModernInvoicePDF({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const c = colors;
  const s = createStyles(colors);
  const balanceDue = Math.max(0, invoice.grandTotal - invoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0));

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.sidebar} />
        <View style={s.content}>
          <View style={s.headerRow}>
            <View>
              <Text style={s.title}>INVOICE</Text>
              <Text style={s.invoiceNum}>#{invoice.number}</Text>
            </View>
            <View>
              <Text style={s.companyName}>{invoice.company?.name || 'Your Company'}</Text>
              <Text style={s.companyDetail}>{invoice.company?.address}</Text>
              <Text style={s.companyDetail}>{invoice.company?.email}</Text>
              <Text style={s.companyDetail}>{invoice.company?.phone}</Text>
            </View>
          </View>

          <View style={s.infoRow}>
            <View style={s.infoBox}>
              <Text style={s.label}>Billed To</Text>
              <Text style={s.clientName}>{invoice.client?.name}</Text>
              {!!invoice.client?.clientCompany && <Text style={{ color: '#555', marginBottom: 2 }}>{invoice.client.clientCompany}</Text>}
              <Text style={{ color: '#666', fontSize: 9 }}>{invoice.client?.billingAddress}</Text>
              {!!invoice.client?.email && <Text style={{ color: '#666', fontSize: 9, marginTop: 2 }}>{invoice.client.email}</Text>}
            </View>
            <View style={s.infoBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: '#666' }}>Issue Date:</Text>
                <Text style={{ fontWeight: 700, color: '#111' }}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: '#666' }}>Due Date:</Text>
                <Text style={{ fontWeight: 700, color: '#111' }}>{new Date(invoice.dueDate).toLocaleDateString()}</Text>
              </View>
              <Text style={{ fontSize: 9, fontWeight: 700, color: invoice.status === 'PAID' ? '#16A34A' : c.primaryColor, backgroundColor: '#F3F4F6', padding: 4, borderRadius: 3, textAlign: 'center' }}>
                {invoice.status.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.col1, s.th]}>#</Text>
              <Text style={[s.col2, s.th]}>Description</Text>
              <Text style={[s.col3, s.th]}>Qty</Text>
              <Text style={[s.col4, s.th]}>Price</Text>
              <Text style={[s.col5, s.th]}>Total</Text>
            </View>
            {invoice.lineItems?.map((item: any, i: number) => (
              <View key={item.id || i} style={s.tableRow}>
                <Text style={[s.col1, { color: '#999' }]}>{i + 1}</Text>
                <Text style={[s.col2, { fontWeight: 700, color: '#111' }]}>{item.description}</Text>
                <Text style={[s.col3, { color: '#666' }]}>{item.quantity}</Text>
                <Text style={[s.col4, { color: '#666' }]}>{invoice.currency} {item.unitPrice.toFixed(2)}</Text>
                <Text style={[s.col5, { fontWeight: 700, color: '#111' }]}>{invoice.currency} {item.lineTotal.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={s.totalsContainer}>
            <View style={s.totalsBox}>
              <View style={s.totalRow}>
                <Text style={{ color: '#666' }}>Subtotal</Text>
                <Text>{invoice.currency} {invoice.subtotal.toFixed(2)}</Text>
              </View>
              {invoice.discountAmount > 0 && (
                <View style={s.totalRow}>
                  <Text style={{ color: '#666' }}>Discount</Text>
                  <Text>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={s.totalRow}>
                <Text style={{ color: '#666' }}>Tax</Text>
                <Text>{invoice.currency} {invoice.taxTotal.toFixed(2)}</Text>
              </View>
              <View style={s.grandTotalRow}>
                <Text style={s.grandTotalText}>Total Due</Text>
                <Text style={s.grandTotalText}>{invoice.currency} {balanceDue.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={s.notesRow}>
            {!!invoice.paymentInstructions && (
              <View style={s.noteBlock}>
                <Text style={s.label}>Payment Instructions</Text>
                <Text style={s.noteText}>{invoice.paymentInstructions}</Text>
              </View>
            )}
            {!!invoice.terms && (
              <View style={s.noteBlock}>
                <Text style={s.label}>Terms & Conditions</Text>
                <Text style={s.noteText}>{invoice.terms}</Text>
              </View>
            )}
          </View>

          <Text style={s.footerText}>Thank you for your business! | {invoice.company?.website || invoice.company?.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
