'use client';

import { Card } from '@/components/ui/card';
import { useVersionsStore } from '@/store/useVersionsStore';
import { cn } from '@/lib/utils';

export function ProjectHeader() {
  const { currentProject, audienceType, setAudienceType, version } = useVersionsStore();
  
  if (!currentProject) return null;
  
  const { name, industry, stage } = currentProject;

  const audienceTypes = [
    {
      value: 'venture' as const,
      emoji: '🚀',
      title: 'Venture Capital',
      description: 'Growth & scalability focus',
    },
    {
      value: 'bank' as const,
      emoji: '🏦',
      title: 'Bank Loan',
      description: 'Financial stability focus',
    },
    {
      value: 'corporate' as const,
      emoji: '🏢',
      title: 'Corporate',
      description: 'Partnership & synergy focus',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className=" flex gap-2  flex-col">
        <h1 className=" text-3xl md:text-6xl font-bold text-gray-900">{name || 'Project'}</h1>
        <div className="flex items-end text-sm">{industry || 'N/A'} | {stage || 'N/A'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-10 py-6">
        {audienceTypes.map((type) => (
          <div
            key={type.value}
            onClick={() => setAudienceType(type.value)}
            className={cn('p-2 px-4 items-center md:items-start flex flex-col md:p-6 border rounded-xl bg-white cursor-pointer transition-all hover:shadow-lg', audienceType === type.value && 'md:scale-110 border-black bg-black/80 text-white opacity-100' )}
          >
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">
                {type.emoji} {type.title}
              </span>
              <span className="text-xs font-normal">
                {type.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
