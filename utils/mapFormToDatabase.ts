import type { ProjectData } from "@/types/project";

export function mapFormToDatabase(formData: ProjectData) {
  const { basicInfo, valueProposition, customerSegments, channels, economics, team, resources, competition, risks, growth } = formData;

  return {
    // Basic Info
    name: basicInfo.projectName,
    description: basicInfo.description,
    industry: basicInfo.industry,
    stage: basicInfo.stage,
    
    // Value Proposition
    value_prop_problem: valueProposition.problem,
    value_prop_solution: valueProposition.solution,
    value_prop_uniqueness: valueProposition.solutionUniqueness,
    value_prop_measurable: valueProposition.measurableValue,
    value_prop_advantages: JSON.stringify(valueProposition.advantages),
    
    // Customer Segments
    customer_primary_segment: customerSegments.primarySegment,
    customer_tam: `${customerSegments.marketSize.tam} - ${customerSegments.marketSize.tamDescription}`,
    customer_sam: `${customerSegments.marketSize.sam} - ${customerSegments.marketSize.samDescription}`,
    customer_som: `${customerSegments.marketSize.som} - ${customerSegments.marketSize.somDescription}`,
    customer_geography: JSON.stringify(customerSegments.geography),
    customer_wtp: customerSegments.willingnessToPay.evidence,
    customer_avg_check: customerSegments.willingnessToPay.averageDealSize,
    
    // Channels
    channels_acquisition: JSON.stringify(channels.acquisitionChannels),
    channels_sales: channels.salesChannel,
    channels_cac: channels.cac,
    channels_cac_description: channels.cacDescription,
    channels_marketing: channels.marketingTools,
    channels_funnel: channels.marketingFunnel,
    
    // Revenue & Economics
    revenue_projected_12m: economics.projectedRevenue12Months,
    revenue_streams: JSON.stringify(economics.revenueStreams),
    revenue_pricing: economics.revenuePricing,
    cost_breakdown: economics.costBreakdown,
    cost_gross_margin: economics.grossMargin,
    arpu: economics.arpu,
    customer_lifetime: economics.customerLifetime,
    contribution_margin: economics.contributionMargin,
    
    // Funding
    funding_raised: economics.fundingRaised,
    funding_sought: economics.amountSeeking,
    funding_sources: JSON.stringify(economics.fundingSources),
    use_of_funds: JSON.stringify(economics.useOfFunds),
    cost_runway: economics.currentRunway,
    
    // Team
    team_founders: team.founderExperience,
    team_key_hires: team.keyRoles,
    team_specialists: team.specialists,
    team_gaps: team.gaps,
    
    // Resources & Activities
    resources_physical: resources.existing,
    resources_intellectual: resources.techStack,
    resources_needed: resources.needed,
    resources_dependencies: resources.dependencies,
    activities_production: resources.activities.production,
    activities_innovation: resources.activities.innovation,
    activities_platform: resources.activities.platform,
    activities_marketing: resources.activities.marketing,
    activities_operations: resources.activities.operations,
    partners_strategic: JSON.stringify(resources.partners),
    
    // Competition
    competitors: `Direct: ${competition.directCompetitors}\n\nIndirect: ${competition.indirectCompetitors}`,
    competition_why_choose: competition.whyChooseYou,
    competition_defensibility: competition.defensibility,
    
    // Risks
    risks: JSON.stringify(risks),
    
    // Growth & Traction
    traction: growth.traction,
    growth_plan: growth.scalingPlan,
    growth_new_markets: growth.newMarkets,
    growth_payback_period: growth.paybackPeriod,
    growth_targets_12m: growth.targets12Months,
    growth_targets_24m: growth.targets24Months,
    growth_targets_36m: growth.targets36Months,
  };
}

