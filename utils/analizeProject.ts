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
  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  console.log(`🤖 Starting AI analysis for audience: ${audienceType}`);
  const startTime = Date.now();
  
  const userPrompt = createProjectPrompt(projectData, audienceType);
  const systemPrompt = getSystemPrompt(audienceType, language);

  const maxRetries = 5;
  let lastError: any = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model,
        max_completion_tokens: 4000, // Optimized: ~3500-4000 tokens needed for full response
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
    } catch (error: any) {
      lastError = error;
      
      // Handle rate limit (429) with retry-after
      if (error?.status === 429 || error?.code === 'rate_limit_exceeded') {
        const retryAfter = error?.headers?.['retry-after-ms'] 
          ? parseInt(error.headers['retry-after-ms']) 
          : error?.headers?.['retry-after']
            ? parseFloat(error.headers['retry-after']) * 1000
            : (attempt + 1) * 30000; // Fallback: 30s, 60s, 90s...
        
        if (attempt < maxRetries - 1) {
          const waitSeconds = Math.ceil(retryAfter / 1000);
          console.log(`⏳ Rate limit hit for ${audienceType}, waiting ${waitSeconds}s before retry ${attempt + 1}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          continue;
        }
      }
      
      // For other errors, retry with exponential backoff
      if (attempt < maxRetries - 1) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30s
        console.log(`⚠️ Error for ${audienceType} (attempt ${attempt + 1}/${maxRetries}), retrying in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Last attempt failed
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`❌ AI analysis failed for ${audienceType} after ${duration}s (${maxRetries} attempts):`, error);
      throw error;
    }
  }
  
  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Analysis failed after all retries');
}
