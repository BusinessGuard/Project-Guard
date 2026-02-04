import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import { PDFData } from './prepareData';
import { CoverPage } from './sections/CoverPage';
import { BusinessScoresPage } from './sections/BusinessScoresPage';
import { FinancialPage } from './sections/FinancialPage';
import { RecommendationsPage } from './sections/RecommendationsPage';
import { GrowthPlanPage } from './sections/GrowthPlanPage';
import { ExpertAnalysisPage } from './sections/ExpertAnalysisPage';

const pageStyle = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 35, // Отступ для footer (footer height ~20 + отступ 15)
    paddingLeft: 30,
    paddingRight: 30,
  },
});

interface ProjectPDFProps {
  data: PDFData;
}

export function ProjectPDF({ data }: ProjectPDFProps) {
  const hasGrowthPlan = data.growthPhases.length > 0;
  const hasExperts = data.experts.length > 0;
  
  return (
    <Document>
      {/* Page 1: Cover & Summary */}
      <Page size="A4" style={pageStyle.page}>
        <CoverPage data={data} />
      </Page>
      
      {/* Page 2: Business Model Scores */}
      <Page size="A4" style={pageStyle.page}>
        <BusinessScoresPage data={data} />
      </Page>
      
      {/* Page 3: Financial Forecast */}
      <Page size="A4" style={pageStyle.page}>
        <FinancialPage data={data} />
      </Page>
      
      {/* Page 4: Recommendations */}
      <Page size="A4" style={pageStyle.page}>
        <RecommendationsPage data={data} />
      </Page>
      
      {/* Page 5: Growth Plan (if available) */}
      {hasGrowthPlan && (
        <Page size="A4" style={pageStyle.page}>
          <GrowthPlanPage data={data} />
        </Page>
      )}
      
      {/* Page 6: Expert Analysis (if available) */}
      {hasExperts && (
        <Page size="A4" style={pageStyle.page}>
          <ExpertAnalysisPage data={data} />
        </Page>
      )}
    </Document>
  );
}
