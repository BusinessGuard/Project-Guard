'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {

  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,

} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,

  Target,
  Zap,
  Shield,
  Download,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Brain,
  BarChart3,
  FileText,
  Rocket,
  Moon,
  Sun,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Flame,
} from 'lucide-react';

// Translations
const translations = {
  en: {
    hero: {
      title: 'ProjectGuard AI',
      subtitle: 'AI-Powered Startup Evaluation in 30 Seconds',
      badge: 'AI-Powered Startup Evaluation',
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
    tabs: {
      overview: 'Overview',
      experts: 'Expert Insights',
      recommendations: 'Recommendations',
      growth: 'Growth Plan',
      financial: 'Financial Forecast',
      history: 'Version History',
      comparison: 'Comparison',
    },
    scores: {
      overall: 'Overall Score',
      exceptional: 'EXCEPTIONAL',
      excellent: 'EXCELLENT',
      good: 'GOOD',
      fair: 'FAIR',
      weak: 'WEAK',
      critical: 'CRITICAL',
    },
    priorityLabels: {
      CRITICAL: 'Critical',
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low',
    },
    chart: {
      score: 'Score',
    },
  },
  ru: {
    hero: {
      title: 'ProjectGuard AI',
      subtitle: 'AI-оценка стартапа за 30 секунд',
      badge: 'AI-оценка стартапа',
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
    tabs: {
      overview: 'Обзор',
      experts: 'Эксперты',
      recommendations: 'Рекомендации',
      growth: 'План роста',
      financial: 'Финансы',
      history: 'История',
      comparison: 'Сравнение',
    },
    scores: {
      overall: 'Общий балл',
      exceptional: 'ИСКЛЮЧИТЕЛЬНО',
      excellent: 'ОТЛИЧНО',
      good: 'ХОРОШО',
      fair: 'УДОВЛЕТВОРИТЕЛЬНО',
      weak: 'СЛАБО',
      critical: 'КРИТИЧНО',
    },
    priorityLabels: {
      CRITICAL: 'Критический',
      HIGH: 'Высокий',
      MEDIUM: 'Средний',
      LOW: 'Низкий',
    },
    chart: {
      score: 'Оценка',
    },
  },
  uk: {
    hero: {
      title: 'ProjectGuard AI',
      subtitle: 'AI-оцінка стартапу за 30 секунд',
      badge: 'AI-оцінка стартапу',
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
    tabs: {
      overview: 'Огляд',
      experts: 'Експерти',
      recommendations: 'Рекомендації',
      growth: 'План зростання',
      financial: 'Фінанси',
      history: 'Історія',
      comparison: 'Порівняння',
    },
    scores: {
      overall: 'Загальний бал',
      exceptional: 'ВИНЯТКОВО',
      excellent: 'ВІДМІННО',
      good: 'ДОБРЕ',
      fair: 'ЗАДОВІЛЬНО',
      weak: 'СЛАБКО',
      critical: 'КРИТИЧНО',
    },
    priorityLabels: {
      CRITICAL: 'Критичний',
      HIGH: 'Високий',
      MEDIUM: 'Середній',
      LOW: 'Низький',
    },
    chart: {
      score: 'Оцінка',
    },
  },
};

// Investor profile weights
const investorProfiles = {
  vc: {
    name: 'Venture Capital',
    weights: {
      valueProposition: 0.20,
      customerSegments: 0.15,
      channels: 0.10,
      revenue: 0.15,
      costs: 0.05,
      keyResources: 0.05,
      keyActivities: 0.05,
      keyPartners: 0.05,
      team: 0.20,
    },
    focus: ['team', 'valueProposition', 'customerSegments'],
  },
  bank: {
    name: 'Bank',
    weights: {
      valueProposition: 0.10,
      customerSegments: 0.10,
      channels: 0.05,
      revenue: 0.25,
      costs: 0.20,
      keyResources: 0.10,
      keyActivities: 0.05,
      keyPartners: 0.05,
      team: 0.10,
    },
    focus: ['revenue', 'costs', 'keyResources'],
  },
  corporate: {
    name: 'Corporation',
    weights: {
      valueProposition: 0.15,
      customerSegments: 0.10,
      channels: 0.10,
      revenue: 0.15,
      costs: 0.10,
      keyResources: 0.10,
      keyActivities: 0.15,
      keyPartners: 0.15,
      team: 0.10,
    },
    focus: ['keyActivities', 'keyPartners', 'valueProposition'],
  },
};

// Demo project data
const DEMO_PROJECT = {
  name: 'HRFlow - Smart HR Automation',
  industry: 'SaaS / B2B HR Tech',
  stage: 'Pre-seed',
  description: 'AI-powered HR platform for SMBs to automate hiring and onboarding',
  versions: [
    { id: 'v1.0', date: '2025-12-01', score: 62, name: 'Initial Version' },
    { id: 'v2.0', date: '2026-01-15', score: 74, name: 'After Customer Validation' },
    { id: 'v3.0', date: '2026-02-01', score: 82, name: 'Current Version (after improvements)' },
  ],
};

const BLOCK_SCORES = {
  valueProposition: 85,
  customerSegments: 78,
  channels: 68,
  revenue: 88,
  costs: 75,
  keyResources: 70,
  keyActivities: 75,
  keyPartners: 65,
  team: 80,
};

const RADAR_DATA = [
  { block: 'Value Prop', score: 85, fullMark: 100 },
  { block: 'Customers', score: 78, fullMark: 100 },
  { block: 'Channels', score: 68, fullMark: 100 },
  { block: 'Revenue', score: 88, fullMark: 100 },
  { block: 'Costs', score: 75, fullMark: 100 },
  { block: 'Resources', score: 70, fullMark: 100 },
  { block: 'Activities', score: 75, fullMark: 100 },
  { block: 'Partners', score: 65, fullMark: 100 },
  { block: 'Team', score: 80, fullMark: 100 },
];

const EXPERT_INSIGHTS = {
  financialExpert: {
    name: 'Maria Rodriguez',
    role: 'Financial Expert',
    avatar: '💰',
    summary: 'Excellent unit economics (LTV/CAC 32.4x) with strong path to profitability.',
    confidence: 88,
    keyFindings: [
      'LTV/CAC ratio of 32.4x is exceptional (benchmark: >3)',
      'Gross margin of 80% is strong for B2B SaaS',
      'Payback period of 0.6 months demonstrates efficient capital deployment',
      'Monthly burn rate well-controlled at €7,000',
    ],
    concerns: [
      'Current runway of 11 months should be extended to 18+ months',
      'Break-even projection at month 18 depends on consistent 15% MoM growth',
    ],
    recommendations: [
      'Secure €75K bridge round to extend runway to 21 months',
      'Build 3-scenario financial model (base, optimistic, pessimistic)',
      'Set up automated financial dashboards for investor updates',
    ],
  },
  marketAnalyst: {
    name: 'David Chen',
    role: 'Market Analyst',
    avatar: '📊',
    summary: 'Large market opportunity (€2.5B TAM) with improving customer validation.',
    confidence: 85,
    keyFindings: [
      'TAM of €2.5B represents venture-scale opportunity',
      'SMB HR tech market growing at 15% CAGR',
      'Customer validation improved from 5 to 25 pilot customers',
      'Clear ICP: 50-500 employee companies in tech/professional services',
    ],
    concerns: [
      'Geographic expansion plan (UK, DE, NL) may dilute focus',
      'Competitive landscape intensifying with 3 new entrants in 2025',
    ],
    recommendations: [
      'Focus exclusively on UK market for first 12 months',
      'Conduct quarterly competitive analysis',
      'Build customer advisory board with 5-7 key customers',
    ],
  },
  productExpert: {
    name: 'Sarah Thompson',
    role: 'Product Expert',
    avatar: '🎯',
    summary: 'Strong value proposition with proven 70% time savings and high NPS of 75.',
    confidence: 90,
    keyFindings: [
      'Clear pain point: HR managers waste 40h/month on manual tasks',
      'Quantified value: reduce hiring time from 45 to 10 days',
      'Product NPS of 75 indicates strong product-market fit',
      '10x improvement vs alternatives (not incremental)',
    ],
    concerns: [
      'Feature roadmap lacks prioritization framework',
      'Technical debt accumulating in core hiring module',
    ],
    recommendations: [
      'Implement RICE prioritization for product roadmap',
      'Allocate 20% of dev capacity to technical debt reduction',
      'Launch beta program for top 3 requested features',
    ],
  },
  marketingExpert: {
    name: 'Alex Kumar',
    role: 'Marketing Expert',
    avatar: '📈',
    summary: 'Validated go-to-market channels with CAC of €55 and improving conversion rates.',
    confidence: 82,
    keyFindings: [
      'CAC of €55 is excellent for B2B SaaS (LTV/CAC = 32.4x)',
      'Product Hunt launch achieved #2 Product of the Day',
      'LinkedIn ads converting at 4.2% (industry avg: 2.5%)',
      'Content marketing generating 40% of qualified leads',
    ],
    concerns: [
      'Heavy reliance on founder-led sales (not scalable)',
      'Email marketing underutilized (only 15% open rate)',
      'No referral program despite high NPS',
    ],
    recommendations: [
      'Launch referral program (20% discount for referrer + referee)',
      'Hire VP Sales to build repeatable sales process',
      'A/B test email subject lines to improve open rates to 25%+',
    ],
  },
  riskManager: {
    name: 'James Foster',
    role: 'Risk Manager',
    avatar: '⚠️',
    summary: 'Well-managed risk profile with effective mitigation strategies in place.',
    confidence: 87,
    keyFindings: [
      'Critical risks identified and documented',
      'Mitigation plans established for top 5 risks',
      'Risk register reviewed monthly',
      'Contingency budget of €20K maintained',
    ],
    criticalRisks: [
      {
        category: 'technical',
        description: 'OpenAI API dependency: 2-3x price increase would impact margins',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Built Claude/Gemini fallback; testing alternative providers',
      },
      {
        category: 'market',
        description: 'Economic downturn reducing SMB hiring budgets',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Diversifying into employee onboarding (recession-resistant)',
      },
      {
        category: 'team',
        description: 'Key person risk: CTO holds all technical knowledge',
        likelihood: 'low',
        impact: 'critical',
        mitigation: 'Documentation in progress; planning contractor backup',
      },
    ],
    concerns: [
      'Regulatory risk: GDPR compliance for EU expansion not fully assessed',
      'Competition from well-funded startups (BambooHR raised $50M)',
    ],
    recommendations: [
      'Conduct GDPR compliance audit with legal counsel',
      'Build competitive moat through proprietary AI training data',
      'Consider key person insurance for founders',
    ],
  },
  opsExpert: {
    name: 'Lisa Wang',
    role: 'Operations Expert',
    avatar: '⚙️',
    summary: 'Strong founding team with complementary skills and clear execution track record.',
    confidence: 86,
    keyFindings: [
      'Founders have domain expertise (10 years HR, 8 years engineering)',
      'Team executed on 90% of Q1 objectives',
      'Clear roles and responsibilities established',
      'Advisor network includes 2 VPs from unicorn SaaS companies',
    ],
    concerns: [
      'No sales expertise on founding team',
      'Customer success process not documented',
      'Hiring plan lacks specific timelines and compensation bands',
    ],
    recommendations: [
      'Hire VP Sales by Month 6 (budget €80K + equity)',
      'Document customer onboarding playbook',
      'Create hiring roadmap with job descriptions and salary ranges',
    ],
  },
};

const CONSENSUS_FINDINGS = {
  topStrengths: [
    'Exceptional unit economics: LTV/CAC 32.4x (all 6 experts agree)',
    'Large market opportunity: €2.5B TAM with 15% CAGR (5 experts)',
    'Strong product-market fit: NPS 75, 90-day retention 87% (5 experts)',
    'Proven value proposition: 70% time savings validated (6 experts)',
    'Solid founding team with domain expertise (4 experts)',
  ],
  topWeaknesses: [
    'Channel strategy needs scaling beyond founder-led sales (5 experts)',
    'Geographic expansion plan too ambitious for resources (4 experts)',
    'Technical debt accumulating in core product (3 experts)',
  ],
  criticalActions: [
    'Hire VP Sales to build scalable sales process (6 experts UNANIMOUS)',
    'Extend runway to 18+ months via bridge funding (5 experts)',
    'Focus on single market (UK) before expanding (4 experts)',
  ],
};

const RECOMMENDATIONS = [
  {
    id: 'rec-1',
    priority: 'CRITICAL',
    category: 'team',
    title: 'Hire VP Sales',
    description: 'Founder-led sales won\'t scale beyond €20K MRR. Need experienced sales leader to build repeatable process.',
    actionSteps: [
      'Define VP Sales job description and compensation (€80K + 1-2% equity)',
      'Post on AngelList, LinkedIn, and startup job boards',
      'Screen 20+ candidates, interview top 5',
      'Check references and conduct trial project',
      'Onboard VP Sales with 30-60-90 day plan',
    ],
    expectedImpact: 'Channels score: 68 → 85 (+17 pts), Overall: 82 → 87 (+5 pts)',
    effort: 'High',
    timeline: '8 weeks',
    expertsSupporting: ['marketingExpert', 'opsExpert', 'financialExpert', 'riskManager', 'marketAnalyst', 'productExpert'],
  },
  {
    id: 'rec-2',
    priority: 'CRITICAL',
    category: 'costs',
    title: 'Extend Financial Runway',
    description: '11 months runway creates pressure and limits strategic options. Extend to 18+ months for safety.',
    actionSteps: [
      'Prepare bridge round deck highlighting traction metrics',
      'Reach out to existing angels for €75K bridge at €3M cap',
      'Negotiate terms (2-week deadline)',
      'Close bridge round and update cap table',
    ],
    expectedImpact: 'Costs score: 75 → 88 (+13 pts), reduces financial risk to LOW',
    effort: 'Medium',
    timeline: '4 weeks',
    expertsSupporting: ['financialExpert', 'riskManager', 'opsExpert', 'marketAnalyst'],
  },
  {
    id: 'rec-3',
    priority: 'HIGH',
    category: 'channels',
    title: 'Launch Referral Program',
    description: 'NPS of 75 indicates customers love product. Leverage this for viral growth.',
    actionSteps: [
      'Design referral mechanics: 20% discount for both parties',
      'Build referral tracking in dashboard',
      'Create email drip campaign to promote referrals',
      'Test with top 10 customers',
      'Scale to all customers if conversion > 15%',
    ],
    expectedImpact: 'Channels score: 68 → 78 (+10 pts), 20-30% of new customers from referrals',
    effort: 'Medium',
    timeline: '3 weeks',
    expertsSupporting: ['marketingExpert', 'productExpert', 'financialExpert'],
  },
];

const GROWTH_PLAN = {
  phase1: {
    name: 'Market Focus & Sales Scaling',
    duration: 'Months 1-3',
    goals: [
      'Hire VP Sales and close first 3 enterprise deals',
      'Launch referral program and achieve 20% referral rate',
      'Reach 50 paying customers (€4,950 MRR)',
      'Maintain 90%+ customer satisfaction (NPS > 70)',
    ],
    keyActions: [
      'Recruit and onboard VP Sales',
      'Build sales playbook and email sequences',
      'Launch referral program',
      'Focus exclusively on UK market',
      'Close €75K bridge round',
    ],
    budget: '€27,000',
    teamSize: '2 founders + 1 developer + 1 VP Sales',
    successMetrics: ['50 customers', '€4,950 MRR', 'NPS > 70', 'VP Sales hired'],
  },
  phase2: {
    name: 'Product Expansion & Seed Round',
    duration: 'Months 4-6',
    goals: [
      'Raise €300K seed round at €4M valuation',
      'Launch employee onboarding module (2nd product line)',
      'Reach 100 paying customers (€9,900 MRR)',
      'Hire Customer Success Manager',
    ],
    keyActions: [
      'Prepare seed deck with traction metrics',
      'Pitch 30+ VCs (target: SaaS/HR tech funds)',
      'Ship onboarding module to 20 beta customers',
      'Scale paid acquisition (LinkedIn, Google Ads)',
      'Document customer success playbook',
    ],
    budget: '€36,000',
    teamSize: '5 people (+ Customer Success Manager)',
    successMetrics: ['€300K raised', '100 customers', '€9,900 MRR', 'Onboarding launched'],
  },
  phase3: {
    name: 'Scale & International',
    duration: 'Months 7-12',
    goals: [
      'Scale to 200 customers (€19,800 MRR)',
      'Expand to Germany market (localization)',
      'Achieve 85% gross retention rate',
      'Prepare for Series A',
    ],
    keyActions: [
      'Launch German version of product',
      'Hire German-speaking sales rep',
      'Build integrations (HRIS, ATS)',
      'Optimize onboarding funnel',
      'Create investor pipeline for Series A',
    ],
    budget: '€72,000',
    teamSize: '8-10 people',
    successMetrics: ['200 customers', '€19,800 MRR', 'Germany: 30 customers', '85% retention'],
  },
};

const FINANCIAL_FORECAST = {
  unitEconomics: {
    ltv: 1782,
    cac: 55,
    ltvCacRatio: 32.4,
    paybackPeriod: 0.6,
    grossMargin: 80,
    churnRate: 15,
  },
  breakEven: {
    month: 16,
    customers: 90,
    mrr: 8910,
  },
  monthlyProjections: [
    { month: 1, revenue: 2475, costs: 7000, profit: -4525, customers: 25, mrr: 2475, runway: 14 },
    { month: 2, revenue: 3465, costs: 7000, profit: -3535, customers: 35, mrr: 3465, runway: 15 },
    { month: 3, revenue: 4851, costs: 7000, profit: -2149, customers: 49, mrr: 4851, runway: 16 },
    { month: 4, revenue: 5940, costs: 8000, profit: -2060, customers: 60, mrr: 5940, runway: 17 },
    { month: 5, revenue: 7128, costs: 8000, profit: -872, customers: 72, mrr: 7128, runway: 18 },
    { month: 6, revenue: 8910, costs: 8000, profit: 910, customers: 90, mrr: 8910, runway: 20 },
    { month: 7, revenue: 10692, costs: 9000, profit: 1692, customers: 108, mrr: 10692, runway: 999 },
    { month: 8, revenue: 12870, costs: 9000, profit: 3870, customers: 130, mrr: 12870, runway: 999 },
    { month: 9, revenue: 15444, costs: 9000, profit: 6444, customers: 156, mrr: 15444, runway: 999 },
    { month: 10, revenue: 17820, costs: 10000, profit: 7820, customers: 180, mrr: 17820, runway: 999 },
    { month: 11, revenue: 19800, costs: 10000, profit: 9800, customers: 200, mrr: 19800, runway: 999 },
    { month: 12, revenue: 21780, costs: 10000, profit: 11780, customers: 220, mrr: 21780, runway: 999 },
  ],
};

function ProjectGuardDemoV2() {
  const [currentView, setCurrentView] = useState('landing');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVersion, setSelectedVersion] = useState('v3.0');
  const [investorProfile, setInvestorProfile] = useState('vc');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ru' | 'uk'>('en');
  const [expandedExperts, setExpandedExperts] = useState<Record<string, boolean>>({});
  const [expandedRecommendations, setExpandedRecommendations] = useState<Record<string, boolean>>({});

  const t = translations[language] || translations.en;
  const priorityLabels = (translations[language] ?? translations.en).priorityLabels;

  // Helper function for inline translations
  const tr = (en: string, ru: string, uk: string): string => {
    switch (language) {
      case 'en': return en;
      case 'ru': return ru;
      case 'uk': return uk;
      default: return en;
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const calculateWeightedScore = () => {
    const profile = investorProfiles[investorProfile as keyof typeof investorProfiles];
    if (!profile) return 75; // fallback
    
    const weights = profile.weights;
    let totalScore = 0;
    
    (Object.keys(BLOCK_SCORES) as Array<keyof typeof BLOCK_SCORES>).forEach((block) => {
      const score = BLOCK_SCORES[block];
      const weight = weights[block] || 0;
      totalScore += score * weight;
    });
    
    return Math.round(totalScore);
  };

  const overallScore = calculateWeightedScore();
  const currentVersion = DEMO_PROJECT.versions.find(v => v.id === selectedVersion);

  const startAnalysis = () => {
    setCurrentView('analyzing');
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentView('results'), 500);
          return 100;
        }
        return prev + 3;
      });
    }, 120);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: t.scores.exceptional, color: 'bg-green-600' };
    if (score >= 80) return { label: t.scores.excellent, color: 'bg-green-500' };
    if (score >= 70) return { label: t.scores.good, color: 'bg-yellow-500' };
    if (score >= 60) return { label: t.scores.fair, color: 'bg-yellow-600' };
    if (score >= 50) return { label: t.scores.weak, color: 'bg-orange-600' };
    return { label: t.scores.critical, color: 'bg-red-600' };
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const toggleExpert = (expertKey: string): void => {
    setExpandedExperts(prev => ({
      ...prev,
      [expertKey]: !prev[expertKey]
    }));
  };

  const toggleRecommendation = (recId: string): void => {
    setExpandedRecommendations(prev => ({
      ...prev,
      [recId]: !prev[recId]
    }));
  };

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        {/* Top Navigation */}
        <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold dark:text-white">ProjectGuard AI</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === 'en'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="English"
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === 'ru'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Русский"
                >
                  🇷🇺 RU
                </button>
                <button
                  onClick={() => setLanguage('uk')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === 'uk'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Українська"
                >
                  🇺🇦 UA
                </button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {language === 'en' ? 'AI-Powered Startup Evaluation' : language === 'ru' ? 'AI-оценка стартапа' : 'AI-оцінка стартапу'}
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
              <a
                href="https://project-guard-quick-score-v2.netlify.app?utm_source=demo&utm_medium=back_button"
                className="inline-flex items-center gap-2 text-lg px-8 py-6 border border-gray-300 dark:border-gray-600 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
                {language === 'en' ? '← Back to Quick Score' : language === 'ru' ? '← Назад к Quick Score' : '← Назад до Quick Score'}
              </a>
              <Button
                onClick={startAnalysis}
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6"
              >
                <Zap className="w-6 h-6" />
                {t.hero.demo}
              </Button>
            </div>
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
              {tr('Evaluation Profiles', 'Профили оценки', 'Профілі оцінки')}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className={`dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-all ${investorProfile === 'vc' ? 'ring-2 ring-green-600' : 'hover:shadow-lg'}`} onClick={() => setInvestorProfile('vc')}>
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
              <Card className={`dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-all ${investorProfile === 'bank' ? 'ring-2 ring-blue-600' : 'hover:shadow-lg'}`} onClick={() => setInvestorProfile('bank')}>
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
              <Card className={`dark:bg-gray-800 dark:border-gray-700 cursor-pointer transition-all ${investorProfile === 'corporate' ? 'ring-2 ring-purple-600' : 'hover:shadow-lg'}`} onClick={() => setInvestorProfile('corporate')}>
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

  // Analysis Loading
  if (currentView === 'analyzing') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <Card className="max-w-2xl w-full dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>

            <h2 className="text-4xl font-bold dark:text-white">
              {tr('AI Expert Panel Analyzing...', 'Панель AI-экспертов анализирует...', 'Панель AI-експертів аналізує...')}
            </h2>

            <Progress value={analysisProgress} className="h-4" />

            <p className="text-gray-600 dark:text-gray-400 text-xl">
              {analysisProgress}% {tr('complete', 'завершено', 'завершено')}
            </p>

            <div className="space-y-3 text-left max-w-md mx-auto pt-6">
              {Object.values(EXPERT_INSIGHTS).map(({ name, role, avatar }, idx) => {
                const done = analysisProgress > (idx + 1) * 16;
                return (
                  <div key={name} className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full animate-spin" />
                    )}
                    <span className="text-2xl">{avatar}</span>
                    <span className={`text-lg ${done ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                      {name}
                    </span>
                    {done && <span className="ml-auto text-sm text-green-600 dark:text-green-400">✓</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Dashboard
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('landing')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {tr('Back', 'Назад', 'Назад')}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-bold text-lg dark:text-white">{DEMO_PROJECT.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{DEMO_PROJECT.industry} • {DEMO_PROJECT.stage}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Version Selector */}
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              {DEMO_PROJECT.versions.map(v => (
                <option key={v.id} value={v.id}>
                  {v.id} - {v.name} ({v.score}/100)
                </option>
              ))}
            </select>

            {/* Investor Profile Selector */}
            <select
              value={investorProfile}
              onChange={(e) => setInvestorProfile(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="vc">{tr('🚀 VC Profile', '🚀 Профиль ВК', '🚀 Профіль ВК')}</option>
              <option value="bank">{tr('🏦 Bank Profile', '🏦 Профиль Банк', '🏦 Профіль Банк')}</option>
              <option value="corporate">{tr('🏢 Corp Profile', '🏢 Профиль Корп', '🏢 Профіль Корп')}</option>
            </select>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="English"
              >
                🇬🇧
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  language === 'ru'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Русский"
              >
                🇷🇺
              </button>
              <button
                onClick={() => setLanguage('uk')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  language === 'uk'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title="Українська"
              >
                🇺🇦
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {tr('Re-analyze', 'Переанализировать', 'Переаналізувати')}
            </Button>

            <Button size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Overall Score Hero Card - Original Gradient Design */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              <div className="text-center">
                <div className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wide">{t.scores.overall}</div>
                <div className="text-7xl font-bold mb-2">{overallScore}</div>
                <div className="text-sm opacity-90">
                  {tr('out of 100', 'из 100', 'з 100')}
                </div>
              </div>

              <div className="text-center">
                <div className={`inline-flex px-6 py-3 ${getScoreBadge(overallScore).color} rounded-full text-white font-bold text-lg mb-3 shadow-lg`}>
                  {getScoreBadge(overallScore).label}
                </div>
                <div className="text-lg font-semibold">
                  {tr('Nearly Ready', 'Почти готов', 'Майже готовий')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">
                  {tr('BENCHMARK', 'БЕНЧМАРК', 'БЕНЧМАРК')}
                </div>
                <div className="text-4xl font-bold mb-1">
                  {tr('Top 24%', 'Топ 24%', 'Топ 24%')}
                </div>
                <div className="text-sm opacity-90">
                  {tr('Better than 76% analyzed', 'Лучше 76% проанализированных', 'Краще ніж 76% проаналізованих')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">
                  {tr('PROFILE', 'ПРОФИЛЬ', 'ПРОФІЛЬ')}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {investorProfile === 'vc' && tr('🚀 VC Focus', '🚀 Фокус ВК', '🚀 Фокус ВК')}
                  {investorProfile === 'bank' && tr('🏦 Bank Focus', '🏦 Фокус Банк', '🏦 Фокус Банк')}
                  {investorProfile === 'corporate' && tr('🏢 Corp Focus', '🏢 Фокус Корп', '🏢 Фокус Корп')}
                </div>
                <div className="text-sm opacity-90">
                  {investorProfile === 'vc' && tr('team, valueProposition, customerSegments', 'команда, ценность, клиенты', 'команда, цінність, клієнти')}
                  {investorProfile === 'bank' && tr('revenue, costs, keyResources', 'выручка, затраты, ресурсы', 'виручка, витрати, ресурси')}
                  {investorProfile === 'corporate' && tr('keyActivities, keyPartners, valueProposition', 'операции, партнеры, ценность', 'операції, партнери, цінність')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version History Timeline - Original Design */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Clock className="w-5 h-5" />
              {tr('Version History', 'История версий', 'Історія версій')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-600" />
              {DEMO_PROJECT.versions.map((version, idx) => (
                <div key={version.id} className="relative flex flex-col items-center flex-1">
                  <button
                    onClick={() => setSelectedVersion(version.id)}
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg mb-3 transition-all ${
                      selectedVersion === version.id
                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:scale-105'
                    }`}
                  >
                    {version.score}
                  </button>
                  <div className="text-center">
                    <div className={`font-semibold text-sm ${selectedVersion === version.id ? 'text-blue-600 dark:text-blue-400' : 'dark:text-white'}`}>
                      {version.id}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{version.date}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-24">{version.name}</div>
                  </div>
                  {idx < DEMO_PROJECT.versions.length - 1 && (
                    <div className="absolute top-8 left-1/2 w-full h-0.5 bg-blue-300 dark:bg-blue-700" style={{ zIndex: -1 }} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses - Original Design */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                {tr('Top Strengths', 'Сильные стороны', 'Сильні сторони')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CONSENSUS_FINDINGS.topStrengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-gray-300">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <AlertTriangle className="w-5 h-5" />
                {tr('Areas for Improvement', 'Зоны для улучшения', 'Зони для покращення')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {CONSENSUS_FINDINGS.topWeaknesses.map((weakness, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-gray-300">{weakness}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger value="overview" className="aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30">
                  {t.tabs.overview}
                </TabsTrigger>
                <TabsTrigger value="experts" className="aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30">
                  {t.tabs.experts}
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30">
                  {t.tabs.recommendations}
                </TabsTrigger>
                <TabsTrigger value="growth" className="aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30">
                  {t.tabs.growth}
                </TabsTrigger>
                <TabsTrigger value="financial" className="aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30">
                  {t.tabs.financial}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6 space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">
                      {tr('9-Block Business Model Analysis', 'Анализ 9 блоков бизнес-модели', 'Аналіз 9 блоків бізнес-моделі')}
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={RADAR_DATA}>
                        <PolarGrid stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                        <PolarAngleAxis dataKey="block" tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }} />
                        <Radar
                          name={(translations[language] ?? translations.en).chart.score}
                          dataKey="score"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.5}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Block Scores Grid */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">
                      {tr('Detailed Block Scores', 'Детальные оценки блоков', 'Детальні оцінки блоків')}
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(BLOCK_SCORES).map(([block, score]) => (
                        <div key={block} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium capitalize dark:text-gray-300">
                              {block.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                              {score}
                            </span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Expert Insights Tab */}
              <TabsContent value="experts" className="p-6 space-y-4">
                {Object.entries(EXPERT_INSIGHTS).map(([expertKey, expert]) => (
                  <Card key={expertKey} className="dark:bg-gray-700 dark:border-gray-600">
                    <CardHeader>
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => toggleExpert(expertKey)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{expert.avatar}</span>
                          <div>
                            <CardTitle className="dark:text-white">{expert.name}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{expert.role}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{expert.summary}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="dark:border-gray-500 dark:text-gray-300">
                            {tr('Confidence', 'Уверенность', 'Впевненість')}: {expert.confidence}%
                          </Badge>
                          {expandedExperts[expertKey] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedExperts[expertKey] && (
                      <CardContent className="space-y-4 pt-0">
                        {expert.keyFindings && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 dark:text-gray-200">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              {tr('Key Findings', 'Ключевые находки', 'Ключові знахідки')}
                            </h4>
                            <ul className="space-y-1">
                              {expert.keyFindings.map((finding, idx) => (
                                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 pl-6">
                                  • {finding}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {'criticalRisks' in expert && expert.criticalRisks && expert.criticalRisks.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 dark:text-gray-200">
                              <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                              {tr('Critical Risks', 'Критические риски', 'Критичні ризики')}
                            </h4>
                            <div className="space-y-2">
                              {expert.criticalRisks.map((risk: any, idx: number) => (
                                <div key={idx} className="border border-red-200 dark:border-red-800 rounded-lg p-3 bg-red-50 dark:bg-red-900/20">
                                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                                    <Badge className="bg-red-600 text-white text-xs">
                                      {risk.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs dark:border-gray-500">
                                      {risk.likelihood} {tr('likelihood', 'вероятность', 'ймовірність')}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs dark:border-gray-500">
                                      {risk.impact} {tr('impact', 'воздействие', 'вплив')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium mb-1 dark:text-gray-200">{risk.description}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    <strong>
                                      {tr('Mitigation:', 'Митигация:', 'Пом\'якшення:')}
                                    </strong> {risk.mitigation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {expert.concerns && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 dark:text-gray-200">
                              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              {tr('Concerns', 'Опасения', 'Занепокоєння')}
                            </h4>
                            <ul className="space-y-1">
                              {expert.concerns.map((concern, idx) => (
                                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 pl-6">
                                  • {concern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {expert.recommendations && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 dark:text-gray-200">
                              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              {tr('Recommendations', 'Рекомендации', 'Рекомендації')}
                            </h4>
                            <ul className="space-y-1">
                              {expert.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 pl-6">
                                  • {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </TabsContent>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="p-6 space-y-4">
                {RECOMMENDATIONS.map((rec) => (
                  <Card key={rec.id} className="dark:bg-gray-700 dark:border-gray-600">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Badge className={`${getPriorityColor(rec.priority)} text-white flex-shrink-0`}>
                          {priorityLabels[rec.priority as keyof typeof priorityLabels] ?? rec.priority}
                        </Badge>
                        <div className="flex-1 space-y-3">
                          <div 
                            className="cursor-pointer"
                            onClick={() => toggleRecommendation(rec.id)}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg dark:text-white">{rec.title}</h3>
                              {expandedRecommendations[rec.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                          </div>

                          {expandedRecommendations[rec.id] && (
                            <>
                              <div>
                                <h4 className="font-medium text-sm mb-2 dark:text-gray-200">
                                  {tr('Action Steps:', 'Шаги действий:', 'Кроки дій:')}
                                </h4>
                                <div className="space-y-2">
                                  {rec.actionSteps.map((step, idx) => (
                                    <label key={idx} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 p-2 rounded">
                                      <input type="checkbox" className="mt-1" />
                                      <span className="dark:text-gray-300">{step}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 pt-2 text-sm">
                                <div>
                                  <span className="font-medium dark:text-gray-200">
                                    {tr('Expected Impact:', 'Ожидаемый эффект:', 'Очікуваний ефект:')}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 ml-2">{rec.expectedImpact}</span>
                                </div>
                                <div>
                                  <span className="font-medium dark:text-gray-200">
                                    {tr('Effort:', 'Усилия:', 'Зусилля:')}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 ml-2">{rec.effort}</span>
                                </div>
                                <div>
                                  <span className="font-medium dark:text-gray-200">
                                    {tr('Timeline:', 'Сроки:', 'Терміни:')}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400 ml-2">{rec.timeline}</span>
                                </div>
                              </div>

                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {tr('Supported by', 'Поддержано', 'Підтримано')} {rec.expertsSupporting.length}/6 {tr('experts', 'экспертами', 'експертами')}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Growth Plan Tab */}
              <TabsContent value="growth" className="p-6 space-y-6">
                {Object.entries(GROWTH_PLAN).filter(([key]) => key.startsWith('phase')).map(([phaseKey, phase]) => (
                  <Card key={phaseKey} className="dark:bg-gray-700 dark:border-gray-600">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="dark:text-white">{phase.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{phase.duration}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {tr('Budget', 'Бюджет', 'Бюджет')}
                          </div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{phase.budget}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 dark:text-gray-200">
                          {tr('Goals:', 'Цели:', 'Цілі:')}
                        </h4>
                        <ul className="space-y-1">
                          {phase.goals.map((goal, idx) => (
                            <li key={idx} className="text-sm pl-4 dark:text-gray-300">
                              {idx + 1}. {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 dark:text-gray-200">
                          {tr('Key Actions:', 'Ключевые действия:', 'Ключові дії:')}
                        </h4>
                        <ul className="space-y-1">
                          {phase.keyActions.map((action, idx) => (
                            <li key={idx} className="text-sm pl-4 dark:text-gray-300">
                              • {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-6 pt-2 text-sm flex-wrap">
                        <div>
                          <span className="font-medium dark:text-gray-200">
                            {tr('Team Size:', 'Размер команды:', 'Розмір команди:')}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">{phase.teamSize}</span>
                        </div>
                        <div>
                          <span className="font-medium dark:text-gray-200">
                            {tr('Success Metrics:', 'Метрики успеха:', 'Метрики успіху:')}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">
                            {phase.successMetrics.join(', ')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Financial Forecast Tab */}
              <TabsContent value="financial" className="p-6 space-y-6">
                {/* Unit Economics Cards */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    {tr('Unit Economics', 'Юнит-экономика', 'Юніт-економіка')}
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">LTV</div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          €{FINANCIAL_FORECAST.unitEconomics.ltv}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">CAC</div>
                        <div className="text-3xl font-bold dark:text-white">
                          €{FINANCIAL_FORECAST.unitEconomics.cac}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">LTV/CAC</div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {FINANCIAL_FORECAST.unitEconomics.ltvCacRatio}x
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {tr('Benchmark: >3x', 'Бенчмарк: >3x', 'Бенчмарк: >3x')}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-700 dark:border-gray-600">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {tr('Payback', 'Окупаемость', 'Окупність')}
                        </div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {FINANCIAL_FORECAST.unitEconomics.paybackPeriod} {tr('mo', 'мес', 'міс')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {tr('Benchmark: <12mo', 'Бенчмарк: <12мес', 'Бенчмарк: <12міс')}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* 12-Month Forecast Chart */}
                <Card className="dark:bg-gray-700 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="dark:text-white">
                      {tr('12-Month Financial Forecast', '12-месячный финансовый прогноз', '12-місячний фінансовий прогноз')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={FINANCIAL_FORECAST.monthlyProjections}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }}
                          label={{ 
                            value: language === 'en' ? 'Month' : (language === 'ru' ? 'Месяц' : 'Місяць'), 
                            position: 'insideBottom', 
                            offset: -5, 
                            fill: darkMode ? '#D1D5DB' : '#6B7280' 
                          }}
                        />
                        <YAxis tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                            border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: darkMode ? '#F3F4F6' : '#111827' }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          strokeWidth={3}
                          name={language === 'en' ? 'Revenue' : (language === 'ru' ? 'Выручка' : 'Виручка')}
                          dot={{ fill: '#10B981', r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="costs"
                          stroke="#EF4444"
                          strokeWidth={2}
                          name={language === 'en' ? 'Costs' : (language === 'ru' ? 'Затраты' : 'Витрати')}
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name={language === 'en' ? 'Profit' : (language === 'ru' ? 'Прибыль' : 'Прибуток')}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Break-even Analysis */}
                <Card className="dark:bg-gray-700 dark:border-gray-600">
                  <CardHeader>
                    <CardTitle className="dark:text-white">
                      {tr('Break-Even Analysis', 'Анализ безубыточности', 'Аналіз беззбитковості')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {tr('Break-Even Month', 'Месяц безубыточности', 'Місяць беззбитковості')}
                        </div>
                        <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                          {FINANCIAL_FORECAST.breakEven.month}
                        </div>
                      </div>
                      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {tr('Customers Needed', 'Клиентов нужно', 'Клієнтів потрібно')}
                        </div>
                        <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                          {FINANCIAL_FORECAST.breakEven.customers}
                        </div>
                      </div>
                      <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {tr('MRR at Break-Even', 'MRR в безубыточности', 'MRR у беззбитковості')}
                        </div>
                        <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                          €{FINANCIAL_FORECAST.breakEven.mrr}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Notice - Original Gradient Design */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {tr('This is a Demo Analysis', 'Это демонстрационный анализ', 'Це демонстраційний аналіз')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {tr(
                    'This demo showcases ProjectGuard AI\'s comprehensive analysis capabilities. The evaluation is generated by 6 AI experts using GPT-4 with our proprietary expert panel system. Try different investor profiles and versions to see how the analysis adapts.',
                    'Это демо показывает возможности комплексного анализа ProjectGuard AI. Оценка генерируется 6 AI-экспертами с использованием GPT-4 и нашей проприетарной системой экспертной панели. Попробуйте разные профили инвесторов и версии, чтобы увидеть, как адаптируется анализ.',
                    'Це демо показує можливості комплексного аналізу ProjectGuard AI. Оцінка генерується 6 AI-експертами з використанням GPT-4 та нашої власної системи експертної панелі. Спробуйте різні профілі інвесторів та версії, щоб побачити, як адаптується аналіз.'
                  )}
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => setCurrentView('landing')} className="gap-2">
                    <Rocket className="w-4 h-4" />
                    {tr('Try With Your Startup', 'Попробуйте со своим стартапом', 'Спробуйте зі своїм стартапом')}
                  </Button>
                  <Button variant="outline" className="gap-2 dark:border-gray-500 dark:text-gray-300">
                    <FileText className="w-4 h-4" />
                    {tr('View Documentation', 'Документация', 'Документація')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProjectGuardDemoV2;
