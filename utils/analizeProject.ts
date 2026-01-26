import { createProjectPrompt, EXPERT_PANEL_SYSTEM_PROMPT } from '@/lib/prompts/project';
import { openai } from '@/lib/openai';

export async function analyzeProject(projectData: any) {
  console.log('Project Data:', JSON.stringify(projectData, null, 2));

  const prompt = createProjectPrompt(projectData);
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.5,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: EXPERT_PANEL_SYSTEM_PROMPT,
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

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error('AI response is not valid JSON:', content);
    throw new Error('Invalid AI response format');
  }

  // Validate required fields
  if (!parsed.overallScore || !parsed.expertAnalyses || !parsed.keyFindings) {
    console.error('Missing required fields in AI response:', parsed);
    throw new Error('Incomplete AI response');
  }

  console.log('Analysis Result:', JSON.stringify(parsed, null, 2));

  return prompt;
}