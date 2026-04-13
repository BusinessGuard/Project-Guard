import { View, Text } from '@react-pdf/renderer';
import type { MonthlyProjection } from '@/store/useAnalizeStore.types';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface FinancialPageProps {
  data: PDFData;
}

export function FinancialPage({ data }: FinancialPageProps) {
  const { financial, labels } = data;
  const f = labels.financial;

  const hasFinancialData = financial.ltv > 0 || financial.cac > 0 || financial.monthlyProjections.length > 0;

  if (!hasFinancialData) {
    return (
      <View style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>{f.title}</Text>
        <View style={{ ...pdfStyles.card, marginTop: 40 }}>
          <Text style={pdfStyles.text}>{f.noData}</Text>
        </View>
        <View style={pdfStyles.footer}>
          <Text>{labels.footer.brand}</Text>
          <Text>{`${labels.footer.pageLabel} 4`}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={pdfStyles.page}>
      <Text style={pdfStyles.sectionTitle}>{f.title}</Text>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.heading}>{f.unitEconomics}</Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>{f.ltv}</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              €{financial.ltv.toLocaleString()}
            </Text>
          </View>

          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>{f.cac}</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              €{financial.cac.toLocaleString()}
            </Text>
          </View>

          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>{f.ltvCacRatio}</Text>
            <Text style={{
              ...pdfStyles.tableCellBold,
              flex: 1,
              textAlign: 'right',
            }}>
              {financial.ltvCacRatio.toFixed(2)}x
            </Text>
          </View>

          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>{f.paybackPeriod}</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              {financial.paybackPeriod} {f.months}
            </Text>
          </View>

          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>{f.grossMargin}</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              {financial.grossMargin}%
            </Text>
          </View>

          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>{f.monthlyChurn}</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              {financial.churnRate}%
            </Text>
          </View>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.heading}>{f.breakEvenHeading}</Text>

        <View style={pdfStyles.card}>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.text}>{f.breakEvenMonth}</Text>
            <Text style={pdfStyles.tableCellBold}>{financial.breakEvenMonth} {f.months}</Text>
          </View>

          <View style={pdfStyles.row}>
            <Text style={pdfStyles.text}>{f.breakEvenCustomers}</Text>
            <Text style={pdfStyles.tableCellBold}>{financial.breakEvenCustomers.toLocaleString()}</Text>
          </View>

          <View style={pdfStyles.row}>
            <Text style={pdfStyles.text}>{f.breakEvenMrr}</Text>
            <Text style={pdfStyles.tableCellBold}>€{financial.breakEvenMRR.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {financial.monthlyProjections.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>{f.projections12}</Text>

          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1 }}>{f.colMonth}</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1.2, textAlign: 'right' }}>{f.colRevenue}</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1.2, textAlign: 'right' }}>{f.colCosts}</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1.2, textAlign: 'right' }}>{f.colProfit}</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>{f.colUsers}</Text>
            </View>

            {financial.monthlyProjections.slice(0, 12).map((projection: MonthlyProjection, index: number) => (
              <View key={index} style={pdfStyles.tableRow}>
                <Text style={{ ...pdfStyles.tableCell, flex: 1 }}>{String(projection.month ?? index + 1)}</Text>
                <Text style={{ ...pdfStyles.tableCell, flex: 1.2, textAlign: 'right' }}>
                  €{Number(projection.revenue ?? 0).toLocaleString()}
                </Text>
                <Text style={{ ...pdfStyles.tableCell, flex: 1.2, textAlign: 'right' }}>
                  €{Number(projection.costs ?? 0).toLocaleString()}
                </Text>
                <Text style={{
                  ...pdfStyles.tableCell,
                  flex: 1.2,
                  textAlign: 'right',
                }}>
                  €{Number(projection.profit ?? 0).toLocaleString()}
                </Text>
                <Text style={{ ...pdfStyles.tableCell, flex: 1, textAlign: 'right' }}>
                  {Number(projection.customers ?? 0).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={pdfStyles.footer}>
        <Text>{labels.footer.brand}</Text>
        <Text>{`${labels.footer.pageLabel} 4`}</Text>
      </View>
    </View>
  );
}
