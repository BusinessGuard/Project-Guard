import { createProjectPrompt, getSystemPrompt } from '@/lib/prompts/project';
import { openai } from '@/lib/openai';
import type { AnalysisApiResponse } from '@/types/analysis-api';

export interface AnalyzeProjectResult {
  analysis: AnalysisApiResponse;
  userPrompt: string;
  systemPrompt: string;
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
  language: string = 'ru',
  audienceType: 'venture' | 'bank' | 'corporate' = 'venture'
): Promise<AnalyzeProjectResult> {
  console.log(`🤖 Starting AI analysis for audience: ${audienceType}`);
  const startTime = Date.now();
  
  const userPrompt = createProjectPrompt(projectData, audienceType);
  const systemPrompt = getSystemPrompt(audienceType, language);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.2',
      max_completion_tokens: 8000,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ AI analysis completed for ${audienceType} in ${duration}s`);

      const content = response.choices[0].message.content;

    if (!content) {
      console.error(`❌ Empty AI response for ${audienceType}`);
      throw new Error('Empty AI response');
    }

    let analysis: AnalysisApiResponse;
    try {
      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysis = JSON.parse(cleanContent) as AnalysisApiResponse;
      console.log(`✅ JSON parsed successfully for ${audienceType}`);
    } catch (e) {
      console.error(`❌ Failed to parse JSON for ${audienceType}:`, e);
      console.error('Raw content preview:', content.substring(0, 500));
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

    console.log(`✅ Analysis result ready for ${audienceType}`);
    return { analysis, userPrompt, systemPrompt, rawResponse };
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`❌ AI analysis failed for ${audienceType} after ${duration}s:`, error);
    throw error;
  }
}
