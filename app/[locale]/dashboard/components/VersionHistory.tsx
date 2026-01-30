'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Lock } from 'lucide-react';
import { useAnalizeStore } from '@/store/useAnalizeStore';
import { useScoreboardState } from '@/store/useState';

export function VersionHistory() {
  const existingVersions = useAnalizeStore((state) => state.versions);
  const { activeVersion, setActiveVersion } = useScoreboardState();

  // Always show 3 slots
  const totalSlots = 3;
  
  // Find version by number in existingVersions array
  const getVersionByNumber = (versionNumber: number) => {
    return existingVersions?.find(v => v.version === versionNumber) || null;
  };

  return (
    <Card className="shadow-none bg-transparent border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex  justify-between relative">
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200" />
          {Array.from({ length: totalSlots }, (_, idx) => {
            const versionNumber = idx + 1; // 1-based version number
            const version = getVersionByNumber(versionNumber);
            const isAvailable = version !== null;
            const isSelected = activeVersion === versionNumber;
            const nextVersion = getVersionByNumber(versionNumber + 1);
            const isNextAvailable = nextVersion !== null;

            return (
              <div key={version?.id || `locked-${idx}`} className="relative flex flex-col items-center flex-1">
                {isAvailable ? (
                  <button
                    onClick={() => setActiveVersion(versionNumber)}
                    className={`size-16 rounded-full border-4 flex items-center justify-center font-bold text-lg mb-3 transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                        : 'bg-white border-gray-300 text-gray-700 hover:scale-105'
                    }`}
                  >
                    {version.score}
                  </button>
                ) : (
                  <div className="size-18 rounded-full  bg-gray-100 flex items-center justify-center mb-3 cursor-not-allowed">
                    <Lock className="size-6 text-gray-400" />
                  </div>
                )}
                {isAvailable && (<div className="text-center">
                  <div className={`font-semibold text-sm ${isSelected ? 'text-blue-600' : ''}`}>
                    V{version.version}
                  </div>
                  <div className="text-xs text-gray-500">{version.date}</div>
                  <div className="text-xs text-gray-600 mt-1 max-w-24">{version.name}</div>
                </div>)}
                {idx < totalSlots - 1 && (
                  <div
                    className={`absolute top-8 left-1/2 w-full h-0.5 ${
                      isAvailable && isNextAvailable ? 'bg-blue-300' : 'bg-gray-200'
                    }`}
                    style={{ zIndex: -1 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
