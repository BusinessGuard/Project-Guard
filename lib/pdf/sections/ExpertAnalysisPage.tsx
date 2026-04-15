import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface ExpertAnalysisPageProps {
  data: PDFData;
}

export function ExpertAnalysisPage({ data }: ExpertAnalysisPageProps) {
  const { experts, labels } = data;
  const e = labels.experts;

  if (experts.length === 0) {
    return null;
  }

  return (
    <View style={pdfStyles.page}>
      <Text style={pdfStyles.sectionTitle}>{e.title}</Text>
      <Text style={{ ...pdfStyles.text, marginBottom: 12 }}>{e.intro}</Text>

      {experts.map((expert, index) => (
        <View key={index} style={{ ...pdfStyles.card, marginBottom: 10 }} wrap={false}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={pdfStyles.heading}>{expert.role.toUpperCase()}</Text>
            <Text style={{ ...pdfStyles.heading, fontSize: 11 }}>
              {e.confidence}: {expert.score}%
            </Text>
          </View>

          {expert.perspective && (
            <View style={{ marginBottom: 6 }}>
              <Text style={pdfStyles.text}>{expert.perspective}</Text>
            </View>
          )}

          {expert.keyFindings && expert.keyFindings.length > 0 && (
            <View style={{ marginBottom: 6 }}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 2 }}>{e.keyFindings}</Text>
              {expert.keyFindings.map((finding, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{finding}</Text>
                </View>
              ))}
            </View>
          )}

          {expert.criticalRisks && expert.criticalRisks.length > 0 && (
            <View style={{ marginBottom: 6 }}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 2 }}>{e.criticalRisks}</Text>
              {expert.criticalRisks.map((risk, i) => (
                <View key={i} style={{ marginBottom: 4 }}>
                  <Text style={{ ...pdfStyles.textSmall, fontWeight: 700 }}>{risk.risk}</Text>
                  <Text style={pdfStyles.textSmall}>
                    {e.likelihood}: {risk.likelihood} | {e.impact}: {risk.impact}
                  </Text>
                  {risk.mitigation && (
                    <Text style={pdfStyles.textSmall}>{e.mitigation}: {risk.mitigation}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {expert.concerns && expert.concerns.length > 0 && (
            <View style={{ marginBottom: 6 }}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 2 }}>{e.concerns}</Text>
              {expert.concerns.map((concern, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{concern}</Text>
                </View>
              ))}
            </View>
          )}

          {expert.recommendations && expert.recommendations.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 2 }}>{e.recommendations}</Text>
              {expert.recommendations.map((rec, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{rec}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={{ ...pdfStyles.card, marginTop: 10 }}>
        <Text style={pdfStyles.textSmall}>{e.disclaimer}</Text>
      </View>

      <View style={pdfStyles.footer}>
        <Text>{labels.footer.brand}</Text>
        <Text>{`${labels.footer.pageLabel} 3`}</Text>
      </View>
    </View>
  );
}
