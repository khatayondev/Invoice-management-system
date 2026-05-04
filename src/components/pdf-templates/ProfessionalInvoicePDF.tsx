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
    page: { padding: 40, fontFamily: 'Inter', fontSize: 10, color: '#333', backgroundColor: c.bgColor },
    header: { backgroundColor: c.primaryColor, color: '#FFF', padding: 30, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 700, color: '#FFF', letterSpacing: 2 },
    invNum: { fontSize: 12, color: '#94A3B8', marginTop: 5 },
    coName: { fontSize: 14, fontWeight: 700, color: '#FFF', marginBottom: 4, textAlign: 'right' },
    coDet: { fontSize: 9, color: '#94A3B8', textAlign: 'right' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 10 },
    label: { fontSize: 9, fontWeight: 700, color: c.secondaryColor, textTransform: 'uppercase', marginBottom: 6 },
    clientName: { fontSize: 12, fontWeight: 700, color: c.primaryColor, marginBottom: 2 },
    detBox: { width: '40%', backgroundColor: '#FFF', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
    table: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', marginBottom: 30 },
    tHead: { flexDirection: 'row', backgroundColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    th: { fontSize: 9, fontWeight: 700, color: c.secondaryColor },
    tRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    c1: { width: '45%' }, c2: { width: '15%', textAlign: 'center' }, c3: { width: '20%', textAlign: 'right' }, c4: { width: '20%', textAlign: 'right' },
    bold: { fontWeight: 700, color: c.primaryColor },
    totBox: { width: '45%', backgroundColor: '#FFF', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
    totR: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    gtR: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginTop: 5, borderTopWidth: 2, borderTopColor: c.primaryColor },
    gt: { fontSize: 14, fontWeight: 700, color: c.primaryColor },
  });
}

export default function ProfessionalInvoicePDF({ invoice, colors }: { invoice: any; colors: ThemeColors }) {
  if (!invoice) return null;
  const c = colors;
  const s = makeStyles(colors);
  const bal = Math.max(0, invoice.grandTotal - invoice.payments.reduce((a: number, p: any) => a + p.amount, 0));
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View><Text style={s.title}>INVOICE</Text><Text style={s.invNum}>Invoice #{invoice.number}</Text></View>
          <View>
            <Text style={s.coName}>{invoice.company?.name || 'Your Company'}</Text>
            <Text style={s.coDet}>{invoice.company?.address}</Text>
            <Text style={s.coDet}>{invoice.company?.email}</Text>
            <Text style={s.coDet}>{invoice.company?.phone}</Text>
          </View>
        </View>
        <View style={s.infoRow}>
          <View style={{ width: '50%' }}>
            <Text style={s.label}>Billed To:</Text>
            <Text style={s.clientName}>{invoice.client?.name}</Text>
            {!!invoice.client?.clientCompany && <Text style={{ color: '#475569', marginBottom: 2 }}>{invoice.client.clientCompany}</Text>}
            <Text style={{ color: '#475569' }}>{invoice.client?.billingAddress}</Text>
            {!!invoice.client?.email && <Text style={{ color: '#475569', marginTop: 2 }}>{invoice.client.email}</Text>}
          </View>
          <View style={s.detBox}>
            <View style={s.totR}><Text style={{ color: c.secondaryColor }}>Issue Date:</Text><Text style={s.bold}>{new Date(invoice.issueDate).toLocaleDateString()}</Text></View>
            <View style={s.totR}><Text style={{ color: c.secondaryColor }}>Due Date:</Text><Text style={s.bold}>{new Date(invoice.dueDate).toLocaleDateString()}</Text></View>
            <View style={[s.totR, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E2E8F0' }]}>
              <Text style={{ color: c.secondaryColor }}>Status:</Text>
              <Text style={[s.bold, { color: invoice.status === 'PAID' ? '#16A34A' : '#DC2626' }]}>{invoice.status.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>
        <View style={s.table}>
          <View style={s.tHead}>
            <Text style={[s.c1, s.th]}>Item</Text><Text style={[s.c2, s.th]}>Qty</Text>
            <Text style={[s.c3, s.th]}>Price</Text><Text style={[s.c4, s.th]}>Total</Text>
          </View>
          {invoice.lineItems?.map((it: any, i: number) => (
            <View key={it.id || i} style={s.tRow}>
              <Text style={[s.c1, s.bold]}>{it.description}</Text><Text style={s.c2}>{it.quantity}</Text>
              <Text style={s.c3}>{invoice.currency} {it.unitPrice.toFixed(2)}</Text>
              <Text style={[s.c4, s.bold]}>{invoice.currency} {it.lineTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 10 }}>
          <View style={s.totBox}>
            <View style={s.totR}><Text style={{ color: c.secondaryColor }}>Subtotal</Text><Text>{invoice.currency} {invoice.subtotal.toFixed(2)}</Text></View>
            {invoice.discountAmount > 0 && <View style={s.totR}><Text style={{ color: c.secondaryColor }}>Discount</Text><Text>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</Text></View>}
            <View style={s.totR}><Text style={{ color: c.secondaryColor }}>Tax</Text><Text>{invoice.currency} {invoice.taxTotal.toFixed(2)}</Text></View>
            <View style={s.gtR}><Text style={s.gt}>Total Due</Text><Text style={s.gt}>{invoice.currency} {bal.toFixed(2)}</Text></View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10, marginTop: 30 }}>
          {!!invoice.paymentInstructions && <View style={{ marginBottom: 15 }}><Text style={s.label}>Payment Instructions</Text><Text style={{ fontSize: 9, color: '#64748B', lineHeight: 1.5 }}>{invoice.paymentInstructions}</Text></View>}
          {!!invoice.terms && <View><Text style={s.label}>Terms & Conditions</Text><Text style={{ fontSize: 9, color: '#64748B', lineHeight: 1.5 }}>{invoice.terms}</Text></View>}
        </View>
      </Page>
    </Document>
  );
}
