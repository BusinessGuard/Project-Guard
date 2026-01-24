import type { ProjectData } from "@/types/project";

export function mapFormToDatabase(formData: ProjectData) {
  const { basicInfo, valueProposition, customerSegments, channels, economics, team, resources, competition, risks, growth } = formData;

  return {
    ...formData,
    
    
    name: basicInfo.projectName,
    
    customer_tam: `${customerSegments.marketSize.tam} - ${customerSegments.marketSize.tamDescription}`,
    customer_sam: `${customerSegments.marketSize.sam} - ${customerSegments.marketSize.samDescription}`,
    customer_som: `${customerSegments.marketSize.som} - ${customerSegments.marketSize.somDescription}`,
    customer_geography: JSON.stringify(customerSegments.geography),
    customer_wtp: customerSegments.willingnessToPay.evidence,
    customer_avg_check: customerSegments.willingnessToPay.averageDealSize,
    
    funding_sought: economics.amountSeeking,
    cost_runway: economics.currentRunway,
    
    competitors: `Direct Competitors:\n${competition.directCompetitors}\n\nIndirect Competitors:\n${competition.indirectCompetitors}`,
    
    risks: JSON.stringify(risks),
    
    growth_plan: growth.scalingPlan,
    
    status: "draft",
  };
}

