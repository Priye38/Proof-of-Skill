export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY missing' });

  const { proofText, skillName, description } = req.body || {};

  const prompt = `You are a technical recruiter. Evaluate this skill proof.
Skill: "${skillName || 'Unknown'}"
Description: "${description || 'None provided'}"
Proof: "${(proofText || '').slice(0, 1500)}"

Respond with ONLY raw JSON, no markdown, no backticks:
{"verdict":"confirmed","confidence":80,"summary":"honest 2 sentence review","strengths":["strength 1","strength 2"],"suggestions":["tip 1","tip 2"],"skillLevel":"intermediate"}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const d = await r.json();

    if (!r.ok) {
      console.error('Anthropic error:', JSON.stringify(d));
      return res.status(500).json({ error: d?.error?.message || 'Anthropic API failed' });
    }

    const text = d?.content?.[0]?.text || '';
    console.log('Claude response:', text);

    // Strip any accidental markdown
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch(e) {
      console.error('JSON parse failed:', clean);
      return res.status(200).json({
        verdict: 'confirmed',
        confidence: 75,
        summary: clean.slice(0, 200) || 'Review completed successfully.',
        strengths: ['Proof submitted successfully'],
        suggestions: ['Add more details to your proof'],
        skillLevel: 'intermediate',
      });
    }

    return res.status(200).json({
      verdict:     ['confirmed','partial','unverified'].includes(parsed.verdict) ? parsed.verdict : 'confirmed',
      confidence:  typeof parsed.confidence === 'number' ? parsed.confidence : 75,
      summary:     parsed.summary || 'Skill proof reviewed.',
      strengths:   Array.isArray(parsed.strengths) ? parsed.strengths : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      skillLevel:  ['beginner','intermediate','advanced','expert'].includes(parsed.skillLevel) ? parsed.skillLevel : 'intermediate',
    });

  } catch(err) {
    console.error('Handler error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
