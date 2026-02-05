import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface FinancialPageProps {
  data: PDFData;
}

export function FinancialPage({ data }: FinancialPageProps) {
  const { financial } = data;
  
  // Check if we have financial data
  const hasFinancialData = financial.ltv > 0 || financial.cac > 0 || financial.monthlyProjections.length > 0;
  
  if (!hasFinancialData) {
    return (
      <View style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>FINANCIAL FORECAST</Text>
        <View style={{ ...pdfStyles.card, marginTop: 40 }}>
          <Text style={pdfStyles.text}>
            No financial data available for this analysis.
          </Text>
        </View>
        <View style={pdfStyles.footer}>
          <Text>ProjectGuard AI</Text>
          <Text>Page 3</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={pdfStyles.page}>
      {/* Page Title */}
      <Text style={pdfStyles.sectionTitle}>FINANCIAL FORECAST</Text>
      
      {/* Unit Economics */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.heading}>Unit Economics</Text>
        
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>Customer Lifetime Value (LTV)</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              ${financial.ltv.toLocaleString()}
            </Text>
          </View>
          
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>Customer Acquisition Cost (CAC)</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              ${financial.cac.toLocaleString()}
            </Text>
          </View>
          
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>LTV/CAC Ratio</Text>
            <Text style={{ 
              ...pdfStyles.tableCellBold, 
              flex: 1, 
              textAlign: 'right',
            }}>
              {financial.ltvCacRatio.toFixed(2)}x
            </Text>
          </View>
          
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>Payback Period</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              {financial.paybackPeriod} months
            </Text>
          </View>
          
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>Gross Margin</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              {financial.grossMargin}%
            </Text>
          </View>
          
          <View style={pdfStyles.tableRow}>
            <Text style={{ ...pdfStyles.tableCell, flex: 1.5 }}>Monthly Churn Rate</Text>
            <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>
              {financial.churnRate}%
            </Text>
          </View>
        </View>
      </View>
      
      {/* Break-Even Analysis */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.heading}>Break-Even Analysis</Text>
        
        <View style={pdfStyles.card}>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.text}>Break-Even Month:</Text>
            <Text style={pdfStyles.tableCellBold}>Month {financial.breakEvenMonth}</Text>
          </View>
          
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.text}>Required Customers:</Text>
            <Text style={pdfStyles.tableCellBold}>{financial.breakEvenCustomers.toLocaleString()}</Text>
          </View>
          
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.text}>Required MRR:</Text>
            <Text style={pdfStyles.tableCellBold}>${financial.breakEvenMRR.toLocaleString()}</Text>
          </View>
        </View>
      </View>
      
      {/* Monthly Projections Table */}
      {financial.monthlyProjections.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>12-Month Projections</Text>
          
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1 }}>Month</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1.2, textAlign: 'right' }}>Revenue</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1.2, textAlign: 'right' }}>Costs</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1.2, textAlign: 'right' }}>Profit</Text>
              <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'right' }}>Users</Text>
            </View>
            
            {financial.monthlyProjections.slice(0, 12).map((projection: any, index: number) => (
              <View key={index} style={pdfStyles.tableRow}>
                <Text style={{ ...pdfStyles.tableCell, flex: 1 }}>{projection.month || index + 1}</Text>
                <Text style={{ ...pdfStyles.tableCell, flex: 1.2, textAlign: 'right' }}>
                  ${(projection.revenue || 0).toLocaleString()}
                </Text>
                <Text style={{ ...pdfStyles.tableCell, flex: 1.2, textAlign: 'right' }}>
                  ${(projection.costs || 0).toLocaleString()}
                </Text>
                <Text style={{ 
                  ...pdfStyles.tableCell, 
                  flex: 1.2,
                  textAlign: 'right',
                }}>
                  ${(projection.profit || 0).toLocaleString()}
                </Text>
                <Text style={{ ...pdfStyles.tableCell, flex: 1, textAlign: 'right' }}>
                  {(projection.customers || 0).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text>ProjectGuard AI</Text>
        <Text>Page 3</Text>
      </View>
    </View>
  );
}
