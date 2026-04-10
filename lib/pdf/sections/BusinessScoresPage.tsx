import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '../styles';
import { PDFData } from '../prepareData';

interface BusinessScoresPageProps {
  data: PDFData;
}

export function BusinessScoresPage({ data }: BusinessScoresPageProps) {
  const { labels } = data;
  const sl = labels.statusLabels;

  const getStatusLabel = (score: number) => {
    if (score >= 80) return { label: sl.strong, style: pdfStyles.statusHigh };
    if (score >= 60) return { label: sl.good, style: pdfStyles.statusMedium };
    if (score >= 40) return { label: sl.needsWork, style: pdfStyles.statusMedium };
    return { label: sl.critical, style: pdfStyles.statusLow };
  };

  const bs = labels.businessScores;

  return (
    <View style={pdfStyles.page}>
      <Text style={pdfStyles.sectionTitle}>{bs.title}</Text>
      <Text style={pdfStyles.text}>{bs.intro}</Text>

      <View style={{ ...pdfStyles.table, marginTop: 20 }}>
        <View style={pdfStyles.tableHeader}>
          <Text style={{ ...pdfStyles.tableCellBold, flex: 2 }}>{bs.colBlock}</Text>
          <Text style={{ ...pdfStyles.tableCellBold, flex: 1, textAlign: 'center' }}>{bs.colScore}</Text>
          <Text style={{ ...pdfStyles.tableCellBold, flex: 1.5 }}>{bs.colStatus}</Text>
        </View>

        {data.blockScores.map((block, index) => {
          const status = getStatusLabel(block.score);
          return (
            <View key={index} style={pdfStyles.tableRow}>
              <Text style={{ ...pdfStyles.tableCell, flex: 2 }}>{block.name}</Text>
              <Text style={{
                ...pdfStyles.tableCellBold,
                flex: 1,
                textAlign: 'center',
                fontSize: 11,
              }}>
                {block.score}/100
              </Text>
              <Text style={{ ...pdfStyles.tableCell, ...status.style, flex: 1.5 }}>
                {status.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={pdfStyles.row}>
        <Text style={pdfStyles.heading}>{bs.averageBlockScore}</Text>
        <Text style={pdfStyles.heading}>
          {Math.round(
            data.blockScores.reduce((sum, block) => sum + block.score, 0) / data.blockScores.length
          )}/100
        </Text>
      </View>

      <View style={{ ...pdfStyles.section, marginTop: 16 }}>
        <Text style={pdfStyles.sectionTitle}>{bs.legend}</Text>
        <View style={pdfStyles.listItem}>
          <Text style={pdfStyles.bullet}>•</Text>
          <Text style={pdfStyles.listContent}>
            <Text style={{ fontWeight: 700 }}>{bs.strongBold}</Text> {bs.strongText}
          </Text>
        </View>
        <View style={pdfStyles.listItem}>
          <Text style={pdfStyles.bullet}>•</Text>
          <Text style={pdfStyles.listContent}>
            <Text style={{ fontWeight: 700 }}>{bs.goodBold}</Text> {bs.goodText}
          </Text>
        </View>
        <View style={pdfStyles.listItem}>
          <Text style={pdfStyles.bullet}>•</Text>
          <Text style={pdfStyles.listContent}>
            <Text style={{ fontWeight: 700 }}>{bs.needsWorkBold}</Text> {bs.needsWorkText}
          </Text>
        </View>
        <View style={pdfStyles.listItem}>
          <Text style={pdfStyles.bullet}>•</Text>
          <Text style={pdfStyles.listContent}>
            <Text style={{ fontWeight: 700 }}>{bs.criticalBold}</Text> {bs.criticalText}
          </Text>
        </View>
      </View>

      <View style={pdfStyles.footer}>
        <Text>{data.labels.cover.generatedBy}</Text>
        <Text>{`${data.labels.footer.pageLabel} 2`}</Text>
      </View>
    </View>
  );
}
