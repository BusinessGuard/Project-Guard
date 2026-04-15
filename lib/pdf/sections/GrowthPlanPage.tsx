import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface GrowthPlanPageProps {
  data: PDFData;
}

export function GrowthPlanPage({ data }: GrowthPlanPageProps) {
  const { growthPhases, labels } = data;
  const g = labels.growthPlan;

  if (growthPhases.length === 0) {
    return null;
  }

  return (
    <View style={pdfStyles.page}>
      <Text style={pdfStyles.sectionTitle}>{g.title}</Text>
      <Text style={{ ...pdfStyles.text, marginBottom: 12 }}>{g.intro}</Text>

      {growthPhases.map((phase, index) => (
        <View key={index} style={{ ...pdfStyles.card, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={pdfStyles.heading}>
              {g.phasePrefix} {index + 1}: {phase.name}
            </Text>
            <Text style={pdfStyles.textSmall}>{phase.duration}</Text>
          </View>

          {phase.goals && phase.goals.length > 0 && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>{g.goals}</Text>
              {phase.goals.map((goal, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>{i + 1}.</Text>
                  <Text style={pdfStyles.listContent}>{goal}</Text>
                </View>
              ))}
            </View>
          )}

          {phase.keyActions && phase.keyActions.length > 0 && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>{g.keyActions}</Text>
              {phase.keyActions.map((action, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{action}</Text>
                </View>
              ))}
            </View>
          )}

          {phase.milestones && phase.milestones.length > 0 && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>{g.milestones}</Text>
              {phase.milestones.map((milestone, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{milestone}</Text>
                </View>
              ))}
            </View>
          )}

          {phase.teamSize && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>{g.teamSize}</Text>
              <Text style={pdfStyles.text}>{phase.teamSize}</Text>
            </View>
          )}

          {phase.successMetrics && phase.successMetrics.length > 0 && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>{g.successMetrics}</Text>
              {phase.successMetrics.map((metric, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{metric}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={pdfStyles.footer}>
        <Text>{labels.footer.brand}</Text>
        <Text>{`${labels.footer.pageLabel} 6`}</Text>
      </View>
    </View>
  );
}
