import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { ThemeColors } from '@/lib/themeColors';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf', fontWeight: 700 }
  ]
});

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    page: { padding: 60, fontFamily: 'Inter', fontSize: 9, color: c.primaryColor, backgroundColor: c.bgColor },
    companyName: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
    sub: { fontSize: 9, color: c.secondaryColor },
    divider: { borderBottomWidth: 1, borderBottomColor: '#E5E5E5', marginVertical: 30 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    half: { width: '45%' },
    label: { fontSize: 8, color: c.secondaryColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    name: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
    tHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: c.primaryColor, paddingBottom: 8, marginBottom: 8 },
    tRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    c1: { width: '50%' }, c2: { width: '15%', textAlign: 'center' }, c3: { width: '15%', textAlign: 'right' }, c4: { width: '20%', textAlign: 'right' },
    th: { fontSize: 8, color: c.secondaryColor, textTransform: 'uppercase' },
    bold: { fontWeight: 700 },
    totR: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    gtR: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, marginTop: 8, borderTopWidth: 1, borderTopColor: c.primaryColor },
    gt: { fontSize: 12, fontWeight: 700 },
    fTitle: { fontSize: 8, color: c.secondaryColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    fText: { fontSize: 9, color: c.secondaryColor, lineHeight: 1.4, marginBottom: 15 },
  });
}

export default function MinimalInvoicePDF({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const s = makeStyles(colors);
  const bal = Math.max(0, invoice.grandTotal - invoice.payments.reduce((a: number, p: any) => a + p.amount, 0));
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ marginBottom: 50 }}>
          <Text style={s.companyName}>{invoice.company?.name || 'Your Company'}</Text>
          <Text style={s.sub}>{invoice.company?.address}</Text>
          <Text style={s.sub}>{invoice.company?.email} {invoice.company?.phone ? `| ${invoice.company.phone}` : ''}</Text>
        </View>
        <View style={s.divider} />
        <View style={s.row}>
          <View style={s.half}>
            <Text style={s.label}>Invoice To</Text>
            <Text style={s.name}>{invoice.client?.name}</Text>
            {!!invoice.client?.clientCompany && <Text style={s.sub}>{invoice.client.clientCompany}</Text>}
            <Text style={s.sub}>{invoice.client?.billingAddress}</Text>
            {!!invoice.client?.email && <Text style={s.sub}>{invoice.client.email}</Text>}
          </View>
          <View style={s.half}>
            <Text style={s.label}>Invoice Details</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={s.sub}>Number:</Text><Text style={s.name}>{invoice.number}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={s.sub}>Issue Date:</Text><Text style={s.sub}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={s.sub}>Due Date:</Text><Text style={s.sub}>{new Date(invoice.dueDate).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 30 }}>
          <View style={s.tHead}>
            <Text style={[s.c1, s.th]}>Description</Text><Text style={[s.c2, s.th]}>Qty</Text>
            <Text style={[s.c3, s.th]}>Price</Text><Text style={[s.c4, s.th]}>Amount</Text>
          </View>
          {invoice.lineItems?.map((it: any, i: number) => (
            <View key={it.id || i} style={s.tRow}>
              <Text style={[s.c1, s.bold]}>{it.description}</Text><Text style={s.c2}>{it.quantity}</Text>
              <Text style={s.c3}>{invoice.currency} {it.unitPrice.toFixed(2)}</Text>
              <Text style={s.c4}>{invoice.currency} {it.lineTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ width: '40%' }}>
            <View style={s.totR}><Text>Subtotal</Text><Text>{invoice.currency} {invoice.subtotal.toFixed(2)}</Text></View>
            {invoice.discountAmount > 0 && <View style={s.totR}><Text>Discount</Text><Text>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</Text></View>}
            <View style={s.totR}><Text>Tax</Text><Text>{invoice.currency} {invoice.taxTotal.toFixed(2)}</Text></View>
            <View style={s.gtR}><Text style={s.gt}>Total Due</Text><Text style={s.gt}>{invoice.currency} {bal.toFixed(2)}</Text></View>
          </View>
        </View>
        <View style={{ marginTop: 50 }}>
          {!!invoice.paymentInstructions && <View style={{ marginBottom: 15 }}><Text style={s.fTitle}>Payment Info</Text><Text style={s.fText}>{invoice.paymentInstructions}</Text></View>}
          {!!invoice.terms && <View><Text style={s.fTitle}>Terms</Text><Text style={s.fText}>{invoice.terms}</Text></View>}
        </View>
      </Page>
    </Document>
  );
}
