import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts that support Cyrillic
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

export const pdfStyles = StyleSheet.create({
  page: {
    // Padding применяется на уровне Page компонента, здесь только стили контента
    fontFamily: 'Roboto',
    fontSize: 9,
    color: '#000000',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  
  // Typography - Строгий стиль
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
    color: '#000000',
  },
  
  subtitle: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 16,
    fontWeight: 400,
  },
  
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 24,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  heading: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 6,
    color: '#000000',
  },
  
  text: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#000000',
  },
  
  textSmall: {
    fontSize: 8,
    color: '#000000',
  },
  
  // Score display - Минимализм
  scoreContainer: {

  },
  
  scoreNumber: {
    fontSize: 36,
    fontWeight: 700,
    color: '#000000',
  },
  
  scoreLabel: {
    fontSize: 9,
    color: '#000000',
    marginTop: 3,
    fontWeight: 400,
  },
  
  // Sections - Больше отступы между секциями
  section: {
    marginBottom: 24,
  },
  
  sectionSmall: {
    marginBottom: 10,
  },
  
  // Lists - Компактнее
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 0,
  },
  
  bullet: {
    width: 12,
    fontSize: 9,
  },
  
  listContent: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.3,
  },
  
  // Tables - Строгий стиль
  table: {
    width: '100%',
    marginBottom: 16,
  },
  
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  
  tableCell: {
    flex: 1,
    fontSize: 8,
    paddingHorizontal: 4,
    color: '#000000',
  },
  
  tableCellBold: {
    flex: 1,
    fontSize: 8,
    fontWeight: 700,
    paddingHorizontal: 4,
    color: '#000000',
  },
  
  // Status badges - Убираем цвета
  statusHigh: {
    color: '#000000',
    fontWeight: 700,
  },
  
  statusMedium: {
    color: '#000000',
    fontWeight: 700,
  },
  
  statusLow: {
    color: '#000000',
    fontWeight: 700,
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  column: {
    flexDirection: 'column',
  },
  
  flex1: {
    flex: 1,
  },
  
  // Priority badges - Черно-белый стиль
  priorityCritical: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: 3,
    fontSize: 7,
    fontWeight: 700,
  },
  
  priorityHigh: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: 3,
    fontSize: 7,
    fontWeight: 700,
  },
  
  priorityMedium: {
    backgroundColor: '#666666',
    color: '#ffffff',
    padding: 3,
    fontSize: 7,
    fontWeight: 700,
  },
  
  // Card - Минималистичный стиль
  card: {
    padding: 10,
    marginBottom: 10,

  },
  
  // Footer - Минимализм, всегда внизу страницы
  footer: {
    position: 'absolute',
    bottom: -10, // Отступ от самого низа страницы
    left: 0, // Соответствует paddingLeft страницы
    right: 0, // Соответствует paddingRight страницы
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 7,
    color: 'gray',
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    height: 20, // Фиксированная высота footer
    marginTop: 20,
    backgroundColor: '#ffffff',
  },
  
  // Header - Строгий стиль
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  
  logo: {
    fontSize: 14,
    fontWeight: 700,
  },
});
