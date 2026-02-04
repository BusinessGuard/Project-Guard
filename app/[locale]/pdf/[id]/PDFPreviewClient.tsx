'use client';

import { useState } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ProjectPDF } from '@/lib/pdf/ProjectPDF';
import { preparePDFData } from '@/lib/pdf/prepareData';
import { VersionsByAudience } from '@/lib/utils/getVersions';
import { toast } from 'sonner';

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
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Prepare PDF data
  const pdfData = preparePDFData(versions, initialVersion, initialAudience);
  
  if (!pdfData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h1>
          <p className="text-gray-600 mb-6">Unable to generate PDF. No analysis data found.</p>
          <Button onClick={() => window.close()}>
            Close
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.info('Generating PDF for download...');
      
      // Generate PDF blob
      const blob = await pdf(<ProjectPDF data={pdfData} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdfData.projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-analysis-v${initialVersion}.pdf`;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Download Button */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-center gap-4">
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {pdfData.projectName} - PDF Preview
            </h1>
            <p className="text-sm text-gray-500">
              Version {initialVersion} • {pdfData.audienceType} Analysis
            </p>
          </div>
          
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2 min-w-[140px]"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
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
            {isDownloading ? 'Downloading PDF...' : 'Download PDF Report'}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-3">
            This report contains {pdfData.recommendations.length} recommendations and detailed financial analysis
          </p>
        </div>
      </div>
    </div>
  );
}
