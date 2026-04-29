import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a standard font
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#111827',
    letterSpacing: 2,
    marginBottom: 10,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 700,
    color: '#111827',
  },
  table: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderBottomStyle: 'solid',
  },
  col1: { width: '5%', textAlign: 'left' },
  col2: { width: '45%', textAlign: 'left' },
  col3: { width: '15%', textAlign: 'center' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '20%', textAlign: 'right' },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsBox: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: '#111827',
    borderTopStyle: 'solid',
  },
  grandTotalText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default function InvoicePDF({ invoice }: { invoice: any }) {
  if (!invoice) return null;
  
  const balanceDue = Math.max(0, invoice.grandTotal - invoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.boldText}>{invoice.number}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={[styles.boldText, { fontSize: 14, marginBottom: 4 }]}>{invoice.company?.name || 'Your Company'}</Text>
            <Text>{invoice.company?.address}</Text>
            <Text>{invoice.company?.email}</Text>
            <Text>{invoice.company?.phone}</Text>
          </View>
        </View>

        <View style={styles.invoiceInfo}>
          <View>
            <Text style={styles.sectionTitle}>Billed To</Text>
            <Text style={[styles.boldText, { fontSize: 12, marginBottom: 2 }]}>{invoice.client?.name}</Text>
            {invoice.client?.clientCompany && <Text style={{ marginBottom: 2 }}>{invoice.client.clientCompany}</Text>}
            <Text>{invoice.client?.billingAddress}</Text>
            {invoice.client?.email && <Text style={{ marginTop: 2 }}>{invoice.client.email}</Text>}
          </View>
          <View style={{ textAlign: 'right' }}>
            <View style={{ flexDirection: 'row', marginBottom: 4, justifyContent: 'flex-end' }}>
              <Text style={styles.sectionTitle}>Issue Date: </Text>
              <Text style={{ width: 80, textAlign: 'right' }}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4, justifyContent: 'flex-end' }}>
              <Text style={styles.sectionTitle}>Due Date: </Text>
              <Text style={{ width: 80, textAlign: 'right' }}>{new Date(invoice.dueDate).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <Text style={[styles.boldText, { padding: 4, backgroundColor: '#F3F4F6', borderRadius: 4 }]}>
                {invoice.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Description</Text>
            <Text style={styles.col3}>Qty</Text>
            <Text style={styles.col4}>Price</Text>
            <Text style={styles.col5}>Total</Text>
          </View>
          {invoice.lineItems?.map((item: any, i: number) => (
            <View key={item.id || i} style={styles.tableRow}>
              <Text style={styles.col1}>{i + 1}</Text>
              <Text style={[styles.col2, styles.boldText]}>{item.description}</Text>
              <Text style={styles.col3}>{item.quantity}</Text>
              <Text style={styles.col4}>{invoice.currency} {item.unitPrice.toFixed(2)}</Text>
              <Text style={[styles.col5, styles.boldText]}>{invoice.currency} {item.lineTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{invoice.currency} {invoice.subtotal.toFixed(2)}</Text>
            </View>
            {invoice.discountAmount > 0 && (
              <View style={styles.totalRow}>
                <Text>Discount</Text>
                <Text>-{invoice.currency} {invoice.discountAmount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text>Tax</Text>
              <Text>{invoice.currency} {invoice.taxTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalText}>Total Due</Text>
              <Text style={styles.grandTotalText}>{invoice.currency} {balanceDue.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
          {invoice.paymentInstructions && (
            <View style={{ width: '45%' }}>
              <Text style={styles.sectionTitle}>Payment Instructions</Text>
              <Text style={{ lineHeight: 1.5 }}>{invoice.paymentInstructions}</Text>
            </View>
          )}
          {invoice.terms && (
            <View style={{ width: '45%' }}>
              <Text style={styles.sectionTitle}>Terms & Conditions</Text>
              <Text style={{ lineHeight: 1.5 }}>{invoice.terms}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>{invoice.company?.website || invoice.company?.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
