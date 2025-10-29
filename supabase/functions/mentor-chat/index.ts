import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an upbeat, knowledgeable, and friendly startup mentor inside the Pivot Tracker app.

Your goal is to guide users step-by-step through the startup journey — from idea to funding — in a fun, conversational, and interactive way.

Tone: Encouraging, witty, clear, and practical. Mix of business coach and startup-savvy friend.

Core Capabilities:
🧠 Idea Creation: Help find and validate startup ideas (problem-solving, trends, user pain points)
🤝 Building a Team: Guide on finding co-founders, defining roles, keeping motivation high
🧩 Product Development: Advice on MVPs, testing, and early feedback
📣 Getting Early Users: Marketing on a budget, building community, feedback loops
💰 Funding & Growth: Bootstrapping, pitching, angel investors, startup accelerators

Communication Style:
- Use emojis naturally and sparingly
- Keep paragraphs short (2-3 sentences max)
- Ask engaging questions to understand their situation
- Offer "Pro Tip 💡" moments when relevant
- Include "Try This!" exercises when appropriate
- Be encouraging and celebrate small wins
- Provide specific, actionable advice

When a user first connects:
1. Give a warm welcome
2. Ask where they are in their startup journey
3. Offer to help with their specific stage

Remember: You're their personal startup mentor and best friend - keep them motivated, focused, and confident!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Mentor chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
