import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface RecommendationsPageProps {
  data: PDFData;
}

export function RecommendationsPage({ data }: RecommendationsPageProps) {
  const { recommendations } = data;
  
  // Group recommendations by priority
  const critical = recommendations.filter(r => r.priority === 'CRITICAL');
  const high = recommendations.filter(r => r.priority === 'HIGH');
  const medium = recommendations.filter(r => r.priority === 'MEDIUM');
  
  const hasRecommendations = recommendations.length > 0;
  
  if (!hasRecommendations) {
    return (
      <View style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>RECOMMENDATIONS</Text>
        <View style={{ ...pdfStyles.card, marginTop: 40 }}>
          <Text style={pdfStyles.text}>
            No specific recommendations available for this analysis.
          </Text>
        </View>
        <View style={pdfStyles.footer}>
          <Text>Project Guard AI</Text>
          <Text>Page 4</Text>
        </View>
      </View>
    );
  }
  
  const renderRecommendation = (rec: any, index: number) => (
    <View key={index} style={{ ...pdfStyles.card, marginBottom: 8 }}>
      {/* Title and Priority */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
        <Text style={{ ...pdfStyles.heading, flex: 1 }}>{rec.title}</Text>

      </View>
      
      {/* Description */}
      <Text style={{ ...pdfStyles.text, marginBottom: 4 }}>{rec.description}</Text>
      
      {/* Meta info */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 3 }}>
        <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>
          Category: {rec.category}
        </Text>
        <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>
          Effort: {rec.effort}
        </Text>
        <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>
          Timeline: {rec.timeline}
        </Text>
      </View>
      
      {/* Action Steps */}
      {rec.actionSteps && rec.actionSteps.length > 0 && (
        <View style={{ marginTop: 4, paddingTop: 4 }}>
          <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>Action Steps:</Text>
          {rec.actionSteps.map((step: string, i: number) => (
            <View key={i} style={pdfStyles.listItem}>
              <Text style={{ ...pdfStyles.bullet, fontSize: 7 }}>{i + 1}.</Text>
              <Text style={{ ...pdfStyles.listContent, fontSize: 8 }}>{step}</Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Expected Impact */}
      {rec.impact && (
        <View style={{ marginTop: 4, paddingTop: 4 }}>
          <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>Expected Impact:</Text>
          <Text style={pdfStyles.textSmall}>{rec.impact}</Text>
        </View>
      )}
    </View>
  );
  
  return (
    <View style={pdfStyles.page}>
      {/* Page Title */}
      <Text style={pdfStyles.sectionTitle}>ACTION PLAN & RECOMMENDATIONS</Text>
      <Text style={{ ...pdfStyles.text, marginBottom: 12 }}>
        Prioritized recommendations based on AI analysis from multiple expert perspectives.
      </Text>
      
      {/* Critical Priority */}
      {critical.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>
            CRITICAL PRIORITY (Do Now)
          </Text>
          {critical.map((rec, index) => renderRecommendation(rec, index))}
        </View>
      )}
      
      {/* High Priority */}
      {high.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>
            HIGH PRIORITY (Next 3 Months)
          </Text>
          {high.slice(0, 3).map((rec, index) => renderRecommendation(rec, index))}
        </View>
      )}
      
      {/* Medium Priority */}
      {medium.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>
            MEDIUM PRIORITY (Next 6 Months)
          </Text>
          {medium.slice(0, 2).map((rec, index) => renderRecommendation(rec, index))}
        </View>
      )}
      
      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text>ProjectGuard AI</Text>
        <Text>Page 4</Text>
      </View>
    </View>
  );
}
