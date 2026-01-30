import { createProjectPrompt, getExpertPanelSystemPrompt } from '@/lib/prompts/project';
import { openai } from '@/lib/openai';

export async function analyzeProject(projectData: any, language: string = 'ru') {
  const prompt = createProjectPrompt(projectData, language);
  const systemPrompt = getExpertPanelSystemPrompt(language);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 8000,
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error('Empty AI response');
  }

  let analysis;
  try {
    let cleanContent = content.trim();
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    analysis = JSON.parse(cleanContent);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    throw new Error('Invalid AI response format');
  }

  return analysis;
}
