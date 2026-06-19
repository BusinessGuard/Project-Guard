'use client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Rocket,
  Zap,
  Brain,
  BarChart3,
  Target,
  TrendingUp,
  Building2,
  Briefcase,
} from 'lucide-react';

interface LandingContentProps {
  language: 'en' | 'ru' | 'uk';
  darkMode: boolean;
  translations: any;
  investorProfile: string;
  onInvestorProfileChange: (profile: string) => void;
  onStartAnalysis: () => void;
  onStartForm: () => void;
}

// Helper function for inline translations
const tr = (en: string, ru: string, uk: string, lang: 'en' | 'ru' | 'uk'): string => {
  switch (lang) {
    case 'en': return en;
    case 'ru': return ru;
    case 'uk': return uk;
    default: return en;
  }
};

export function LandingContent({
  language,
  darkMode,
  translations,
  investorProfile,
  onInvestorProfileChange,
  onStartAnalysis,
  onStartForm,
}: LandingContentProps) {
  const t = translations;

  return (
    <div className={`min-h-screen transition-colors bg-gradient-to-br from-blue-50 via-white to-purple-50`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {tr('AI-Powered Startup Evaluation', 'AI-оценка стартапа', 'AI-оцінка стартапу', language)}
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
            {t.hero.title}
          </h1>

          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.hero.description}
          </p>

          <div className="flex gap-4 justify-center pt-6">
            <Button
              onClick={onStartForm}
              size="lg"
              className="gap-2 text-lg px-8 py-6"
            >
              <Rocket className="w-6 h-6" />
              {t.hero.cta}
            </Button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
            {t.hero.trusted}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 pb-12">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold text-lg mb-2 dark:text-white">{t.features.experts}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.features.expertsDesc}
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="font-bold text-lg mb-2 dark:text-white">{t.features.blocks}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.features.blocksDesc}
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="font-bold text-lg mb-2 dark:text-white">{t.features.roadmap}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.features.roadmapDesc}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investor Profiles Preview */}
        <div className="pb-16">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
            {tr('Evaluation Profiles', 'Профили оценки', 'Профілі оцінки', language)}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card 
              className={`dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-all ${investorProfile === 'vc' ? 'ring-2 ring-green-600' : 'hover:shadow-lg'}`} 
              onClick={() => onInvestorProfileChange('vc')}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <CardTitle className="dark:text-white">{t.profiles.vc.title}</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.profiles.vc.focus}
                </p>
              </CardHeader>
            </Card>
            <Card 
              className={`dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-all ${investorProfile === 'bank' ? 'ring-2 ring-blue-600' : 'hover:shadow-lg'}`} 
              onClick={() => onInvestorProfileChange('bank')}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <CardTitle className="dark:text-white">{t.profiles.bank.title}</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.profiles.bank.focus}
                </p>
              </CardHeader>
            </Card>
            <Card 
              className={`dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-all ${investorProfile === 'corporate' ? 'ring-2 ring-purple-600' : 'hover:shadow-lg'}`} 
              onClick={() => onInvestorProfileChange('corporate')}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                  <CardTitle className="dark:text-white">{t.profiles.corporate.title}</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.profiles.corporate.focus}
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
