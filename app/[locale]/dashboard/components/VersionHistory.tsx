'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Lock, Plus } from 'lucide-react';
import { useVersionsStore } from '@/store/useVersionsStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthPromptModal } from '@/components/AuthPromptModal';

interface VersionHistoryProps {
  isAuthorized?: boolean;
}

export function VersionHistory({ isAuthorized = false }: VersionHistoryProps) {
  const router = useRouter();
  const { versions, version, setVersion, currentProject } = useVersionsStore();
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Always show 3 slots
  const totalSlots = 3;
  
  // Get version data by number
  const getVersionByNumber = (versionNumber: number) => {
    const versionData = versions[versionNumber];
    return versionData?.venture || null;
  };
  
  const handleReAnalyze = () => {
    if (!isAuthorized) {
      setShowAuthModal(true);
      return;
    }
    if (currentProject?.project_id) {
      router.push(`/create?projectId=${currentProject.project_id}`);
    }
  };

  return (
    <>
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
              const versionData = getVersionByNumber(versionNumber);
              const isAvailable = versionData !== null;
              const isSelected = version === versionNumber;
              const nextVersion = getVersionByNumber(versionNumber + 1);
              const isNextAvailable = nextVersion !== null;

              return (
                <div key={versionData?.id || `locked-${idx}`} className="relative flex flex-col items-center flex-1 ">
                  {isAvailable ? (
                    <button
                      onClick={() => setVersion(versionNumber)}
                      className={`size-16 rounded-full border-4 flex items-center justify-center font-bold text-lg mb-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:scale-105'
                      }`}
                    >
                      {versionData.overall_score || 0}
                    </button>
                  ) : (
                    <div 
                      className="relative group"
                      onMouseEnter={() => setHoveredSlot(idx)}
                      onMouseLeave={() => setHoveredSlot(null)}
                    >
                      <button
                        onClick={handleReAnalyze}
                        className="size-18 rounded-full  cursor-pointer bg-gray-100 flex items-center justify-center mb-3 transition-all hover:bg-gray-200 hover:scale-105"
                        title="Re-analyze project"
                      >
                        {hoveredSlot === idx ? (
                          <Plus className="size-8 text-gray-600" />
                        ) : (
                          <Lock className="size-6 text-gray-400" />
                        )}
                      </button>
                      {hoveredSlot === idx && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap">
                          Re-analyze project
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                      )}
                    </div>
                  )}
                  {isAvailable && (<div className="text-center">
                    <div className={`font-semibold text-sm ${isSelected ? 'text-blue-600' : ''}`}>
                      V{versionNumber}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(versionData.created_at).toISOString().split('T')[0]}</div>
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

      <AuthPromptModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign up first"
        message="Sign up first to explore all features."
      />
    </>
  );
}
