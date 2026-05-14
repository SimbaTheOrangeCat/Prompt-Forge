import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, apiKey } = await req.json();
  if (!prompt) return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });

  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: 'No API key' }, { status: 401 });

  const client = new Anthropic({ apiKey: key });

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are an expert prompt engineer. Analyze this prompt and respond with JSON only (no prose):

PROMPT:
${prompt}

Respond with this exact JSON structure:
{
  "scores": { "clarity": 0-100, "structure": 0-100, "specificity": 0-100, "technique": 0-100 },
  "issues": ["list of specific weaknesses"],
  "suggestions": ["list of concrete improvements"],
  "optimized": "the full improved prompt"
}`,
    }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return NextResponse.json({ error: 'Invalid response from Claude' }, { status: 500 });

  const result = JSON.parse(jsonMatch[0]);
  const overall = Math.round(
    (result.scores.clarity + result.scores.structure + result.scores.specificity + result.scores.technique) / 4
  );
  return NextResponse.json({ ...result, scores: { ...result.scores, overall } });
}
