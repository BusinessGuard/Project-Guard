'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
  import { useScoreboardState } from '@/store/useState';

export function ScoreboardHeader() {
  const { existingVersions, activeVersion, setActiveVersion } = useScoreboardState();

  // Find current version by version number
  const currentVersion = existingVersions?.find(v => v.version === activeVersion);

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center justify-between w-full">
          <Select 
            value={activeVersion.toString()} 
            onValueChange={(value) => setActiveVersion(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue>
                {currentVersion ? `v${currentVersion.version} - ${currentVersion.name}` : 'Select version'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {existingVersions?.map((v) => (
                <SelectItem key={v.id} value={v.version.toString()}>
                  <div className="flex flex-col gap-1 px-2">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-base gap-1">V{v.version}</span>
                      <span className="text-xs text-muted-foreground">({v.score}/100)</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{v.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Re-analyze
            </Button>
            <LanguageSwitcher />
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
