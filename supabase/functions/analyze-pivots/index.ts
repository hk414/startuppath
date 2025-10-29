import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pivots } = await req.json();

    if (!pivots || pivots.length === 0) {
      throw new Error('No pivots provided for analysis');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Format pivot data for analysis
    const pivotSummary = pivots.map((p: any, idx: number) => 
      `${idx + 1}. ${p.title} (${p.pivot_date})
   - What Changed: ${p.description}
   - Decision: ${p.decision_made}
   - Reasoning: ${p.reasoning || 'Not provided'}
   - Outcome: ${p.outcome || 'Not provided'}
   - Lessons: ${p.lessons_learned || 'Not provided'}`
    ).join('\n\n');

    const systemPrompt = `You are an experienced startup advisor analyzing a founder's pivot history. Provide insightful analysis focusing on:

1. **Patterns & Trends**: What patterns emerge across their pivots?
2. **What Went Right**: Successful decisions and positive outcomes
3. **What Went Wrong**: Challenges faced and lessons learned
4. **Key Recommendations**: 2-3 actionable insights for future decisions

Be specific, reference their actual pivots, and provide constructive guidance. Use a friendly, mentoring tone. Format with clear sections using markdown-style headers (##). Keep it under 300 words but substantive.`;

    const userPrompt = `Analyze these pivots from a startup founder's journey:\n\n${pivotSummary}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error('Failed to analyze pivots');
    }

    const data = await response.json();
    const insights = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ insights }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-pivots function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
