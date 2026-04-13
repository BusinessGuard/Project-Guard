import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface CoverPageProps {
  data: PDFData;
}

export function CoverPage({ data }: CoverPageProps) {
  return (
    <View style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.logo}>{data.labels.cover.logo}</Text>
        <Text style={pdfStyles.textSmall}>{data.labels.cover.reportType}</Text>
      </View>
      
      {/* Project Title */}
      <View>
        <Text style={pdfStyles.title}>{data.projectName}</Text>
        <Text style={pdfStyles.subtitle}>
          {data.industry} | {data.stage} | {data.audienceTitle} {data.labels.cover.analysisSuffix}
        </Text>
      </View>
      
      {/* Overall Score - Деловой стиль, по центру */}
      <View style={{ 
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 10,

      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ 
            fontSize: 36,
            fontWeight: 700,
            color: '#000000',
          }}>
            {data.overallScore}/100
          </Text>
          <View style={{
            width: 1,
            height: 28,
            backgroundColor: '#000000',
            marginLeft: 10,
            marginRight: 10,
          }} />
          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={{ 
              fontSize: 8,
              color: '#000000',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 4,
            }}>
              {data.labels.cover.overallScore}
            </Text>
            <Text style={{ 
              fontSize: 11,
              color: '#000000',
              fontWeight: 500,
              letterSpacing: 0.3,
            }}>
              {data.readinessStatus}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Benchmark */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{data.labels.cover.benchmark}</Text>
        <Text style={pdfStyles.text}>
          {data.coverBenchmarkText}
        </Text>
      </View>
      
      {/* Top Strengths */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{data.labels.cover.keyStrengths}</Text>
        {data.topStrengths.slice(0, 3).map((strength, index) => (
          <View key={index} style={pdfStyles.listItem}>
            <Text style={pdfStyles.bullet}>•</Text>
            <Text style={pdfStyles.listContent}>{strength}</Text>
          </View>
        ))}
      </View>
      
      {/* Areas to Improve */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{data.labels.cover.areasToImprove}</Text>
        {data.topWeaknesses.slice(0, 3).map((weakness, index) => (
          <View key={index} style={pdfStyles.listItem}>
            <Text style={pdfStyles.bullet}>•</Text>
            <Text style={pdfStyles.listContent}>{weakness}</Text>
          </View>
        ))}
      </View>
      
      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text>{data.labels.cover.generatedBy}</Text>
        <Text>{data.generatedDate}</Text>
      </View>
    </View>
  );
}
