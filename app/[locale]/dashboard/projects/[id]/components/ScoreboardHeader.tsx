'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useVersionsStore } from '@/store/useVersionsStore';
import { useRouter } from '@/lib/navigation';
import { AuthPromptModal } from '@/components/AuthPromptModal';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

interface ScoreboardHeaderProps {
  isAuthorized?: boolean;
}

export function ScoreboardHeader({ isAuthorized = false }: ScoreboardHeaderProps) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const locale = useLocale();
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
      const pdfUrl = `/${locale}/pdf/${currentProject.project_id}?version=${version}&audience=${audienceType}`;
      window.open(pdfUrl, '_blank');
    }
  };

  // Get all version numbers
  const versionNumbers = Object.keys(versions).map(Number).sort((a, b) => b - a);
  const currentVersionData = versions[version];

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            {/* First row: Logo/Select and buttons */}
            <div className="flex items-center justify-between w-full">
              {isAuthorized ? (
                <div className="hidden md:block">
                  <Select value={version.toString()} onValueChange={(value) => setVersion(parseInt(value, 10))}>
                    <SelectTrigger className="w-[240px]">
                      <SelectValue>
                        <div className="flex items-center gap-2 min-w-0">
                          {currentProject?.name ? (
                            <>
                              <span className="font-bold text-base shrink-0">v{version}</span>
                              <span className="text-sm text-muted-foreground truncate min-w-0">{currentProject.name}</span>
                            </>
                          ) : (
                            <span>{t('selectVersion')}</span>
                          )}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent >
                      {versionNumbers.map((versionNum) => {
                        const versionData = versions[versionNum];
                        const ventureVersion = versionData?.venture;
                        const projectName = versionData?.venture?.name || versionData?.bank?.name || versionData?.corporate?.name || '';
                        return (
                          <SelectItem key={versionNum} value={versionNum.toString()} className="px-2">
                            <div className="flex items-center justify-between gap-2 min-w-0 w-full">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="font-bold text-base shrink-0">V{versionNum}</span>
                                {projectName && (
                                  <span className="text-sm text-muted-foreground truncate min-w-0">{projectName}</span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground shrink-0">({ventureVersion?.overall_score}/100)</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Link href="/" className="text-2xl w-30 font-bold text-black hover:opacity-80 transition-opacity">
                  AI Guard
                </Link>
              )}

              <div className="flex items-center gap-2 w-full md:w-auto ml-auto">
                <Button className="gap-2 mr-auto md:mr-0" onClick={handleReAnalyze}>
                  <RefreshCw className="w-4 h-4" />
                  {t('reAnalyze')}
                </Button>
                <LanguageSwitcher />
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={handleOpenPDFPreview}
                >
                  <Download className="w-4 h-4" />
                  {t('pdf')}
                </Button>
              </div>
            </div>

            {/* Second row: Select (mobile only) */}
            {isAuthorized && (
              <div className="md:hidden w-full">
                <Select value={version.toString()} onValueChange={(value) => setVersion(parseInt(value, 10))}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <div className="flex items-center gap-2 min-w-0">
                        {currentProject?.name ? (
                          <>
                            <span className="font-bold text-base shrink-0">v{version}</span>
                            <span className="text-sm text-muted-foreground truncate min-w-0">{currentProject.name}</span>
                          </>
                        ) : (
                          <span>{t('selectVersion')}</span>
                        )}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent >
                    {versionNumbers.map((versionNum) => {
                      const versionData = versions[versionNum];
                      const ventureVersion = versionData?.venture;
                      const projectName = versionData?.venture?.name || versionData?.bank?.name || versionData?.corporate?.name || '';
                      return (
                        <SelectItem key={versionNum} value={versionNum.toString()} className="px-2">
                          <div className="flex items-center justify-between gap-2 min-w-0 w-full">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="font-bold text-base shrink-0">V{versionNum}</span>
                              {projectName && (
                                <span className="text-sm text-muted-foreground truncate min-w-0">{projectName}</span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">({ventureVersion?.overall_score}/100)</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthPromptModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={t('signUpFirst')}
        message={t('signUpFirstMessage')}
      />
    </>
  );
}
