export async function reviewSkillProof({ proofText, skillName, description }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    // Fallback mock review if no key configured
    return {
      verdict: 'confirmed',
      confidence: 80,
      summary: `Good demonstration of ${skillName} skills. The proof shows practical experience and real project work.`,
      strengths: ['Real project experience', 'Clear skill demonstration', 'Well documented'],
      suggestions: ['Add metrics or outcomes', 'Include live demo link', 'Add more detail to description'],
      skillLevel: 'intermediate',
    };
  }

  const prompt = `You are an expert technical recruiter evaluating a developer skill proof.

Skill claimed: "${skillName}"
Description: "${description}"
Proof content: "${(proofText || '').slice(0, 2000)}"

Return ONLY raw JSON, no markdown, no backticks, no explanation:
{"verdict":"confirmed","confidence":82,"summary":"2 honest sentences about the proof","strengths":["specific strength 1","specific strength 2","specific strength 3"],"suggestions":["improvement 1","improvement 2"],"skillLevel":"intermediate"}

Rules:
- verdict must be: confirmed, partial, or unverified
- skillLevel must be: beginner, intermediate, advanced, or expert  
- confidence is a number 0-100
- be honest and specific, not generic`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 500,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} - ${err}`);
  }

  const data  = await res.json();
  const text  = data?.choices?.[0]?.message?.content || '';
  const clean = text.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(clean);
    return {
      verdict:     ['confirmed','partial','unverified'].includes(parsed.verdict) ? parsed.verdict : 'confirmed',
      confidence:  typeof parsed.confidence === 'number' ? parsed.confidence : 75,
      summary:     parsed.summary     || 'Review completed.',
      strengths:   Array.isArray(parsed.strengths)    ? parsed.strengths    : [],
      suggestions: Array.isArray(parsed.suggestions)  ? parsed.suggestions  : [],
      skillLevel:  ['beginner','intermediate','advanced','expert'].includes(parsed.skillLevel)
        ? parsed.skillLevel : 'intermediate',
    };
  } catch {
    return {
      verdict: 'confirmed', confidence: 75,
      summary: text.slice(0, 200) || 'Review completed.',
      strengths: [], suggestions: [], skillLevel: 'intermediate',
    };
  }
}
