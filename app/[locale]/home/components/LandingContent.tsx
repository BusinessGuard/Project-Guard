'use client';
import { useState } from 'react';
import { Card,  CardHeader, CardTitle } from '@/components/ui/card';
import {

  Brain,
  BarChart3,
  Target,
  TrendingUp,
  Building2,
  Briefcase,
} from 'lucide-react';

// Translations

// Helper function for inline translations
const tr = (en: string, ru: string, uk: string, lang: 'en' | 'ru' | 'uk'): string => {
  switch (lang) {
    case 'en': return en;
    case 'ru': return ru;
    case 'uk': return uk;
    default: return en;
  }
};

export function LandingContent() {
  const [language] = useState<'en' | 'ru' | 'uk'>('en');
  const [investorProfile, setInvestorProfile] = useState('vc');

  const t = translations[language] || translations.en;

  return (
      <div className='w-full flex flex-col gap-4 md:gap-10 flex-1 justify-center'>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          {tr('Why ProjectGuard AI?', 'Почему ProjectGuard AI?', 'Чому ProjectGuard AI?', language)}
        </h2>
        <p className="md:text-xl w-4/5 self-center text-gray-600 text-center mb-10">{t.hero.description}</p>


        <div className="grid xl:grid-cols-3 gap-6 pb-12 items-end w-full">
          {[
            { Icon: Brain, iconColor: 'text-blue-600', title: t.features.experts, description: t.features.expertsDesc, image: '/images/landing-1.webp' },
            { Icon: BarChart3, iconColor: 'text-purple-600', title: t.features.blocks, description: t.features.blocksDesc, image: '/images/landing-2.webp' },
            { Icon: Target, iconColor: 'text-green-600', title: t.features.roadmap, description: t.features.roadmapDesc, image: '/images/landing-3.webp' },
          ].map(({ title, description, image }, index) => {
            const isMiddle = index === 1;
             return (
               <Card 
                 key={index} 
                 className={`overflow-hidden shadow-none transition-transform duration-300 flex flex-col p-0 group ${
                   isMiddle ? 'xl:scale-110 z-10' : 'xl:scale-90 z-0'
                 }`}
               >
                 {/* Large screens: background image with text overlay */}
                 <div className="hidden lg:flex relative pt-60 lg:pb-4 lg:px-4 overflow-hidden">
                   {/* Image background */}
                   <div 
                     className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
                     style={{
                       backgroundImage: `url(${image})`,
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       backgroundRepeat: 'no-repeat',
                     }}
                   />
                   
                   {/* White content area at bottom */}
                   <div className="rounded-lg flex flex-col justify-center bg-white dark:bg-gray-800 p-2 z-10 px-4">
                     <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                     <p className="text-xs text-gray-600">
                       {description}
                     </p>
                   </div>
                 </div>

                 {/* Small screens: image on top, text below */}
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

        {/* Investor Profiles Preview */}
        <div className="pb-16 w-full ">
          <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">
            {tr('Evaluation Profiles', 'Профили оценки', 'Профілі оцінки', language)}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { id: 'vc', Icon: TrendingUp, iconColor: 'text-green-600', bgColor: 'bg-green-500',  profile: t.profiles.vc },
              { id: 'bank', Icon: Building2, iconColor: 'text-blue-600', bgColor: 'bg-blue-500',  profile: t.profiles.bank },
              { id: 'corporate', Icon: Briefcase, iconColor: 'text-purple-600', bgColor: 'bg-purple-500',  profile: t.profiles.corporate },
            ].map(({ id, Icon, iconColor, bgColor,  profile }) => (
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
                    <CardTitle className={`transition-colors duration-500 ease-in-out ${investorProfile === id ? 'text-white' : 'dark:text-white'}`}>{profile.title}</CardTitle>
                  </div>
                  <p className={`text-sm transition-colors duration-500 ease-in-out ${investorProfile === id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {profile.focus}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">{t.hero.trusted}</p>
        </div>
      </div>
  );
}

const translations = {
  en: {
    hero: {
      title: 'ProjectGuard AI',
      subtitle: 'AI-Powered Startup Evaluation in 30 Seconds',
      description: 'Your startup analyzed by 6 expert AI evaluators. Get investor-ready with concrete action plan.',
      cta: 'Start Free Analysis',
      demo: 'View Demo Analysis',
      trusted: 'Trusted by 500+ founders | 1,000+ startups analyzed',
    },
    features: {
      experts: '6 AI Experts',
      expertsDesc: 'Financial, Market, Product, Marketing, Risk, Operations',
      blocks: '9-Block Analysis',
      blocksDesc: 'Complete Business Model Canvas evaluation',
      roadmap: 'Action Roadmap',
      roadmapDesc: 'Prioritized steps to improve your score',
    },
    profiles: {
      vc: {
        title: 'Venture Capital',
        focus: 'Focus on growth, team, and scalability',
      },
      bank: {
        title: 'Bank',
        focus: 'Focus on financials, risks, and stability',
      },
      corporate: {
        title: 'Corporation',
        focus: 'Focus on synergy and operations',
      },
    },
  },
  ru: {
    hero: {
      title: 'ProjectGuard AI',
      subtitle: 'AI-оценка стартапа за 30 секунд',
      description: 'Ваш стартап анализируют 6 экспертов на базе AI. Станьте готовы к инвесторам с конкретным планом действий.',
      cta: 'Начать бесплатный анализ',
      demo: 'Посмотреть демо',
      trusted: 'Доверяют 500+ основателей | Проанализировано 1,000+ стартапов',
    },
    features: {
      experts: '6 AI экспертов',
      expertsDesc: 'Финансы, Рынок, Продукт, Маркетинг, Риски, Операции',
      blocks: 'Анализ 9 блоков',
      blocksDesc: 'Полная оценка бизнес-модели',
      roadmap: 'План действий',
      roadmapDesc: 'Приоритетные шаги для улучшения',
    },
    profiles: {
      vc: {
        title: 'Венчурный фонд',
        focus: 'Фокус на росте, команде и масштабируемости',
      },
      bank: {
        title: 'Банк',
        focus: 'Фокус на финансах, рисках и стабильности',
      },
      corporate: {
        title: 'Корпорация',
        focus: 'Фокус на синергии и операциях',
      },
    },
  },
  uk: {
    hero: {
      title: 'ProjectGuard AI',
      subtitle: 'AI-оцінка стартапу за 30 секунд',
      description: 'Ваш стартап аналізують 6 експертів на базі AI. Станьте готовими до інвесторів з конкретним планом дій.',
      cta: 'Почати безкоштовний аналіз',
      demo: 'Подивитись демо',
      trusted: 'Довіряють 500+ засновників | Проаналізовано 1,000+ стартапів',
    },
    features: {
      experts: '6 AI експертів',
      expertsDesc: 'Фінанси, Ринок, Продукт, Маркетинг, Ризики, Операції',
      blocks: 'Аналіз 9 блоків',
      blocksDesc: 'Повна оцінка бізнес-моделі',
      roadmap: 'План дій',
      roadmapDesc: 'Пріоритетні кроки для покращення',
    },
    profiles: {
      vc: {
        title: 'Венчурний фонд',
        focus: 'Фокус на зростанні, команді та масштабованості',
      },
      bank: {
        title: 'Банк',
        focus: 'Фокус на фінансах, ризиках та стабільності',
      },
      corporate: {
        title: 'Корпорація',
        focus: 'Фокус на синергії та операціях',
      },
    },
  },
};
