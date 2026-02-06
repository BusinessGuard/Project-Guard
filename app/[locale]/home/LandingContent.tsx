'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card,  CardHeader, CardTitle } from '@/components/ui/card';
import {
  Brain,
  BarChart3,
  Target,
  TrendingUp,
  Building2,
  Briefcase,
} from 'lucide-react';

export function LandingContent() {
  const t = useTranslations('home');
  const [investorProfile, setInvestorProfile] = useState('vc');

  return (
      <div className='w-full flex flex-col gap-4 md:gap-10 flex-1 justify-center'>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          {t('whyTitle')}
        </h2>
        <p className="md:text-xl w-4/5 self-center text-gray-600 text-center mb-10">{t('description')}</p>


        <div className="grid xl:grid-cols-3 gap-6 pb-12 items-end w-full">
          {[
            { Icon: Brain, iconColor: 'text-blue-600', title: t('features.experts'), description: t('features.expertsDesc'), image: '/images/landing-1.webp' },
            { Icon: BarChart3, iconColor: 'text-purple-600', title: t('features.blocks'), description: t('features.blocksDesc'), image: '/images/landing-2.webp' },
            { Icon: Target, iconColor: 'text-green-600', title: t('features.roadmap'), description: t('features.roadmapDesc'), image: '/images/landing-3.webp' },
          ].map(({ title, description, image }, index) => {
            const isMiddle = index === 1;
             return (
               <Card 
                 key={index} 
                 className={`overflow-hidden shadow-none transition-transform duration-300 flex flex-col p-0 group ${
                   isMiddle ? 'xl:scale-110 z-10' : 'xl:scale-90 z-0'
                 }`}
               >
                 <div className="hidden lg:flex relative pt-60 lg:pb-4 lg:px-4 overflow-hidden">
                   <div 
                     className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
                     style={{
                       backgroundImage: `url(${image})`,
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       backgroundRepeat: 'no-repeat',
                     }}
                   />
                   
                   <div className="rounded-lg flex flex-col justify-center bg-white dark:bg-gray-800 p-2 z-10 px-4">
                     <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                     <p className="text-xs text-gray-600">
                       {description}
                     </p>
                   </div>
                 </div>

                 <div className="flex lg:hidden flex-col overflow-hidden">
                   <div 
                     className="w-full h-48 transition-transform duration-2000 ease-out group-hover:scale-110"
                     style={{
                       backgroundImage: `url(${image})`,
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       backgroundRepeat: 'no-repeat',
                     }}
                   />
                   <div className="p-4 bg-white dark:bg-gray-800">
                     <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                       {description}
                     </p>
                   </div>
                 </div>
               </Card>
             );
          })}
        </div>

        <div className="pb-16 w-full ">
          <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">
            {t('evaluationProfiles')}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { id: 'vc', Icon: TrendingUp, iconColor: 'text-green-600', bgColor: 'bg-green-500' },
              { id: 'bank', Icon: Building2, iconColor: 'text-blue-600', bgColor: 'bg-blue-500' },
              { id: 'corporate', Icon: Briefcase, iconColor: 'text-purple-600', bgColor: 'bg-purple-500' },
            ].map(({ id, Icon, iconColor, bgColor }) => (
              <Card 
                key={id}
                className={`shadow-none cursor-pointer transition-all duration-500 ease-in-out ${
                  investorProfile === id 
                    ? `${bgColor} ` 
                    : 'bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg'
                }`} 
                onClick={() => setInvestorProfile(id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 justify-center">
                    <Icon className={`size-8 transition-colors duration-500 ease-in-out ${investorProfile === id ? 'text-white' : iconColor}`} />
                    <CardTitle className={`transition-colors duration-500 ease-in-out ${investorProfile === id ? 'text-white' : 'dark:text-white'}`}>
                      {t(`profiles.${id}.title`)}
                    </CardTitle>
                  </div>
                  <p className={`text-sm transition-colors duration-500 ease-in-out ${investorProfile === id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {t(`profiles.${id}.focus`)}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">{t('trusted')}</p>
        </div>
      </div>
  );
}
