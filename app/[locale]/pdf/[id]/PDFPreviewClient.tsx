'use client';

import { useMemo, useState } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ProjectPDF } from '@/lib/pdf/ProjectPDF';
import { preparePDFData } from '@/lib/pdf/prepareData';
import { buildPdfDocumentLabels } from '@/lib/pdf/pdfDocumentLabels';
import { VersionsByAudience } from '@/lib/utils/getVersions';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';

// Transliterate Cyrillic to Latin
function transliterate(text: string): string {
  const cyrillicToLatin: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };
  
  return text.split('').map(char => cyrillicToLatin[char] || char).join('');
}

interface PDFPreviewClientProps {
  versions: VersionsByAudience;
  initialVersion: number;
  initialAudience: 'venture' | 'bank' | 'corporate';
  isAuthorized: boolean;
}

export function PDFPreviewClient({ 
  versions, 
  initialVersion, 
  initialAudience,
  isAuthorized 
}: PDFPreviewClientProps) {
  const t = useTranslations('pdf');
  const tDoc = useTranslations('pdfDocument');
  const localeRaw = useLocale();
  const locale = (locales.includes(localeRaw as Locale) ? localeRaw : 'en') as Locale;
  const [isDownloading, setIsDownloading] = useState(false);

  const labels = useMemo(
    () => buildPdfDocumentLabels((key, values) => tDoc(key, values)),
    [tDoc]
  );

  const pdfData = useMemo(() => {
    const base = preparePDFData(versions, initialVersion, initialAudience, labels, locale);
    if (!base) return null;
    return {
      ...base,
      coverBenchmarkText: tDoc('cover.benchmarkCompared', { percent: base.benchmarkPercentile }),
    };
  }, [versions, initialVersion, initialAudience, labels, locale, tDoc]);

  if (!pdfData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('noDataTitle')}</h1>
          <p className="text-gray-600 mb-6">{t('noDataMessage')}</p>
          <Button onClick={() => window.close()}>
            {t('close')}
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.info(t('generatingPdf'));
      
      // Generate PDF blob
      const blob = await pdf(<ProjectPDF data={pdfData} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Transliterate Cyrillic to Latin and sanitize filename
      const transliterated = transliterate(pdfData.projectName);
      const sanitizedName = transliterated.replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, '-').toLowerCase();
      link.download = `${sanitizedName}-analysis-v${initialVersion}.pdf`;
      
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      toast.success(t('pdfDownloaded'));
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error(t('pdfDownloadFailed'));
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-center gap-4">
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {pdfData.projectName} - {t('preview')}
            </h1>
            <p className="text-sm text-gray-500">
              {t('version')} {initialVersion} • {t(`audienceTypes.${initialAudience}`)} {t('analysis')}
            </p>
          </div>
          
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2 min-w-[140px]"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? t('downloading') : t('downloadPdf')}
          </Button>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-1 py-8">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
            <PDFViewer 
              width="100%" 
              height="100%"
              showToolbar={false}
              className="border-0"
            >
              <ProjectPDF data={pdfData} />
            </PDFViewer>
          </div>
        </div>
      </div>
      
      {/* Bottom Download Button */}
      <div className="sticky bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-[900px] mx-auto px-6 py-6">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full h-14 text-lg gap-3"
            size="lg"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? t('downloadingPdf') : t('downloadPdfReport')}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-3">
            {t('reportContains', { count: pdfData.recommendations.length })}
          </p>
        </div>
      </div>
    </div>
  );
}
