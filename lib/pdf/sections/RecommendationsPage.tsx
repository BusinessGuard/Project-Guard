import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface RecommendationsPageProps {
  data: PDFData;
}

export function RecommendationsPage({ data }: RecommendationsPageProps) {
  const { recommendations, labels } = data;
  const r = labels.recommendations;

  const critical = recommendations.filter((x) => x.priority === 'CRITICAL');
  const high = recommendations.filter((x) => x.priority === 'HIGH');
  const medium = recommendations.filter((x) => x.priority === 'MEDIUM');

  const hasRecommendations = recommendations.length > 0;

  if (!hasRecommendations) {
    return (
      <View style={pdfStyles.page}>
        <Text style={pdfStyles.sectionTitle}>{r.title}</Text>
        <View style={{ ...pdfStyles.card, marginTop: 40 }}>
          <Text style={pdfStyles.text}>{r.empty}</Text>
        </View>
        <View style={pdfStyles.footer}>
          <Text>{labels.footer.brand}</Text>
          <Text>{`${labels.footer.pageLabel} 5`}</Text>
        </View>
      </View>
    );
  }

  const renderRecommendation = (rec: (typeof recommendations)[0], index: number) => (
    <View key={index} style={{ ...pdfStyles.card, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
        <Text style={{ ...pdfStyles.heading, flex: 1 }}>{rec.title}</Text>
      </View>

      <Text style={{ ...pdfStyles.text, marginBottom: 4 }}>{rec.description}</Text>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 3 }}>
        <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>
          {r.category}: {rec.category}
        </Text>
        <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>
          {r.effort}: {rec.effort}
        </Text>
        <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>
          {r.timeline}: {rec.timeline}
        </Text>
      </View>

      {rec.actionSteps && rec.actionSteps.length > 0 && (
        <View style={{ marginTop: 4, paddingTop: 4 }}>
          <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>{r.actionSteps}</Text>
          {rec.actionSteps.map((step, i) => (
            <View key={i} style={pdfStyles.listItem}>
              <Text style={{ ...pdfStyles.bullet, fontSize: 7 }}>{i + 1}.</Text>
              <Text style={{ ...pdfStyles.listContent, fontSize: 8 }}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {rec.impact && (
        <View style={{ marginTop: 4, paddingTop: 4 }}>
          <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>{r.expectedImpact}</Text>
          <Text style={pdfStyles.textSmall}>{rec.impact}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={pdfStyles.page}>
      <Text style={pdfStyles.sectionTitle}>{r.titleLong}</Text>
      <Text style={{ ...pdfStyles.text, marginBottom: 12 }}>{r.intro}</Text>

      {critical.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>{r.criticalSection}</Text>
          {critical.map((rec, index) => renderRecommendation(rec, index))}
        </View>
      )}

      {high.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>{r.highSection}</Text>
          {high.slice(0, 3).map((rec, index) => renderRecommendation(rec, index))}
        </View>
      )}

      {medium.length > 0 && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>{r.mediumSection}</Text>
          {medium.slice(0, 2).map((rec, index) => renderRecommendation(rec, index))}
        </View>
      )}

      <View style={pdfStyles.footer}>
        <Text>{labels.footer.brand}</Text>
        <Text>{`${labels.footer.pageLabel} 5`}</Text>
      </View>
    </View>
  );
}
