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
    const { pivots, startupName, currentStage } = await req.json();
    
    if (!pivots || pivots.length === 0) {
      throw new Error('No pivot data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating investor report for', pivots.length, 'pivots');

    const systemPrompt = `You are an expert startup advisor and pitch deck creator. Your task is to create a compelling investor presentation based on a startup's pivot history. 

Create a professional, investment-ready report in markdown format that tells the story of resilience, learning, and strategic growth. Structure it as:

# [Startup Name] - Investor Report
## Executive Summary
## Our Journey: Key Strategic Pivots
## What We Learned
## Current Position & Traction
## Why This Makes Us Investment-Ready
## The Path Forward

Make it compelling, data-driven where possible, and focus on how the pivots demonstrate market validation, founder resilience, and strategic thinking. Use professional language suitable for investors.`;

    const userPrompt = `Create an investor presentation for ${startupName || 'our startup'}, currently at ${currentStage || 'growth'} stage.

Here is our pivot history:

${pivots.map((pivot: any, idx: number) => `
**Pivot ${idx + 1}: ${pivot.title}** (${new Date(pivot.pivot_date).toLocaleDateString()})
- Decision: ${pivot.decision_made}
- Reasoning: ${pivot.reasoning || 'N/A'}
- Outcome: ${pivot.outcome || 'In progress'}
- Key Lessons: ${pivot.lessons_learned || 'N/A'}
`).join('\n')}

Generate a compelling investor report that:
1. Shows our journey and strategic thinking
2. Highlights key learnings and market insights
3. Demonstrates founder resilience and adaptability
4. Positions us as a strong investment opportunity
5. Includes a clear vision for the future

Make it professional, concise (2-3 pages), and investment-ready.`;

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
      console.error('AI Gateway Error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add credits to continue.');
      }
      throw new Error('Failed to generate report');
    }

    const result = await response.json();
    const report = result.choices[0].message.content;

    console.log('Report generated successfully');

    return new Response(
      JSON.stringify({ report }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-investor-report function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
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
