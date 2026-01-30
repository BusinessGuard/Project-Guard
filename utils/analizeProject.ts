import { createProjectPrompt, getExpertPanelSystemPrompt } from '@/lib/prompts/project';
import { openai } from '@/lib/openai';
import type { AnalysisApiResponse } from '@/types/analysis-api';

export interface AnalyzeProjectResult {
  analysis: AnalysisApiResponse;
  userPrompt: string;
  rawResponse: {
    id: string;
    model: string;
    object: string;
    created: number;
    choices: Array<{
      index: number;
      message: { role: string; content: string | null };
      finish_reason: string;
    }>;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  };
}

export async function analyzeProject(
  projectData: any,
  language: string = 'ru'
): Promise<AnalyzeProjectResult> {
  const userPrompt = createProjectPrompt(projectData, language);
  const systemPrompt = getExpertPanelSystemPrompt(language);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8000,
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error('Empty AI response');
  }

  let analysis: AnalysisApiResponse;
  try {
    let cleanContent = content.trim();
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    analysis = JSON.parse(cleanContent) as AnalysisApiResponse;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    throw new Error('Invalid AI response format');
  }

  const rawResponse = {
    id: response.id,
    model: response.model ?? '',
    object: response.object ?? 'chat.completion',
    created: response.created ?? 0,
    choices: response.choices.map((c) => ({
      index: c.index,
      message: {
        role: c.message?.role ?? 'assistant',
        content: c.message?.content ?? null,
      },
      finish_reason: c.finish_reason ?? 'stop',
    })),
    usage: response.usage
      ? {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
        }
      : undefined,
  };

  return { analysis, userPrompt, rawResponse };
}
