import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface GrowthPlanPageProps {
  data: PDFData;
}

export function GrowthPlanPage({ data }: GrowthPlanPageProps) {
  const { growthPhases } = data;
  
  const hasGrowthPlan = growthPhases.length > 0;
  
  if (!hasGrowthPlan) {
    return null; // Don't render page if no growth plan
  }
  
  return (
    <View style={pdfStyles.page}>
      {/* Page Title */}
      <Text style={pdfStyles.sectionTitle}>GROWTH ROADMAP</Text>
      <Text style={{ ...pdfStyles.text, marginBottom: 12 }}>
        Strategic phases to scale your business from current state to target goals.
      </Text>
      
      {/* Phases */}
      {growthPhases.map((phase, index) => (
        <View key={index} style={{ ...pdfStyles.card, marginBottom: 12 }}>
          {/* Phase Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={pdfStyles.heading}>
              Phase {index + 1}: {phase.name}
            </Text>
            <Text style={pdfStyles.textSmall}>{phase.duration}</Text>
          </View>
          
          {/* Goals */}
          {phase.goals && phase.goals.length > 0 && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>
                Goals:
              </Text>
              {phase.goals.map((goal, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{goal}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Key Actions */}
          {phase.keyActions && phase.keyActions.length > 0 && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>
                Key Actions:
              </Text>
              {phase.keyActions.map((action, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{action}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Milestones */}
          {phase.milestones && phase.milestones.length > 0 && (
            <View style={pdfStyles.sectionSmall}>
              <Text style={{ ...pdfStyles.text, fontWeight: 700, marginBottom: 3 }}>
                Milestones:
              </Text>
              {phase.milestones.map((milestone, i) => (
                <View key={i} style={pdfStyles.listItem}>
                  <Text style={pdfStyles.bullet}>•</Text>
                  <Text style={pdfStyles.listContent}>{milestone}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
      
      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text>ProjectGuard AI</Text>
        <Text>Page 5</Text>
      </View>
    </View>
  );
}
