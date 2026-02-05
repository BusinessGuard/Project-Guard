'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useVersionsStore } from '@/store/useVersionsStore';
import { useRouter } from '@/lib/navigation';
import { AuthPromptModal } from '@/components/AuthPromptModal';

interface ScoreboardHeaderProps {
  isAuthorized?: boolean;
}

export function  ScoreboardHeader({ isAuthorized = false }: ScoreboardHeaderProps) {
  const router = useRouter();
  const { versions, version, setVersion, currentProject, audienceType } = useVersionsStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleReAnalyze = () => {
    if (!isAuthorized) {
      setShowAuthModal(true);
      return;
    }
    if (currentProject?.project_id) {
      router.push(`/create?projectId=${currentProject.project_id}`);
    }
  };
  
  const handleOpenPDFPreview = () => {
    if (currentProject?.project_id) {
      // Open PDF preview in new tab (outside dashboard layout)
      const pdfUrl = `/pdf/${currentProject.project_id}?version=${version}&audience=${audienceType}`;
      window.open(pdfUrl, '_blank');
    }
  };

  // Get all version numbers
  const versionNumbers = Object.keys(versions).map(Number).sort((a, b) => b - a);
  const currentVersionData = versions[version];

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          <div className="flex items-center justify-between w-full">
            {isAuthorized ? (
              <Select value={version.toString()} onValueChange={(value) => setVersion(parseInt(value, 10))}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue>
                    {currentVersionData ? `v${version}` : 'Select version'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent >
                  {versionNumbers.map((versionNum) => {
                    const versionData = versions[versionNum];
                    const ventureVersion = versionData?.venture;
                    return (
                      <SelectItem key={versionNum} value={versionNum.toString()} className="px-2 flex items-center justify-between">
                          <span className="font-bold text-base">V{versionNum}</span>
                          <span className="text-xs text-muted-foreground">({ventureVersion?.overall_score}/100)</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Link href="/" className="text-2xl w-30 font-bold text-black hover:opacity-80 transition-opacity">
                ProjectGuard AI
              </Link>
            )}

            <div className={`flex items-center gap-2 ${!isAuthorized ? 'w-full justify-end' : ''}`}>
              <Button className="gap-2" onClick={handleReAnalyze}>
                <RefreshCw className="w-4 h-4" />
                Re-analyze
              </Button>
              <LanguageSwitcher />
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleOpenPDFPreview}
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthPromptModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign up first"
        message="Sign up first to explore all features."
      />
    </>
  );
}
