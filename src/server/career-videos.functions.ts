import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  domain: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  // Optional personalization signal — used to rerank, never to filter access
  personalization: z
    .object({
      name: z.string().max(100).optional(),
      headline: z.string().max(200).optional(),
    })
    .optional(),
});

export type CareerVideo = {
  title: string;
  url: string;
  source: string; // e.g. "YouTube", "LinkedIn Learning", "Microsoft Reactor"
  speaker: string;
  duration: string;
  tag: string;
  why: string; // 1-line "why this video"
};

export type CareerVideoResult = {
  videos: CareerVideo[];
  error: string | null;
};

const TAGS = [
  "Interview Prep",
  "Day in the Life",
  "Salary Negotiation",
  "Tech Round Walkthrough",
  "Behavioral Questions",
  "Resume Review",
];

export const fetchCareerVideos = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<CareerVideoResult> => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      return { videos: [], error: "AI service is not configured." };
    }

    const personalNote = data.personalization?.headline
      ? `The user's LinkedIn headline is: "${data.personalization.headline}". Rerank results so the most relevant ones for this exact background appear first, but include a diverse set.`
      : "Return generic, broadly useful results.";

    const systemPrompt = `You are a career-video curator for a professional search engine. Given a domain, position, and company, return a list of 6 real, currently-available videos covering: ${TAGS.join(
      ", "
    )}. Prefer YouTube, LinkedIn Learning, Microsoft Reactor, official company channels, and well-known career creators. Use real URLs that you are highly confident exist. ${personalNote}`;

    const userPrompt = `Domain: ${data.domain}\nPosition: ${data.position}\nCompany: ${data.company}\n\nReturn 6 videos, one per category in order: ${TAGS.join(
      ", "
    )}.`;

    try {
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
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_videos",
                description: "Return curated career videos.",
                parameters: {
                  type: "object",
                  properties: {
                    videos: {
                      type: "array",
                      minItems: 6,
                      maxItems: 6,
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          url: { type: "string" },
                          source: { type: "string" },
                          speaker: { type: "string" },
                          duration: { type: "string" },
                          tag: { type: "string", enum: TAGS },
                          why: { type: "string" },
                        },
                        required: ["title", "url", "source", "speaker", "duration", "tag", "why"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["videos"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_videos" } },
        }),
      });

      if (response.status === 429) {
        return { videos: [], error: "Too many requests — try again in a moment." };
      }
      if (response.status === 402) {
        return { videos: [], error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." };
      }
      if (!response.ok) {
        const text = await response.text();
        console.error("AI gateway error:", response.status, text);
        return { videos: [], error: "Could not load videos right now." };
      }

      const json = await response.json();
      const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall?.function?.arguments) {
        return { videos: [], error: "Unexpected response from AI." };
      }
      const parsed = JSON.parse(toolCall.function.arguments) as { videos: CareerVideo[] };
      return { videos: parsed.videos ?? [], error: null };
    } catch (err) {
      console.error("fetchCareerVideos failed:", err);
      return { videos: [], error: "Unable to reach the AI service." };
    }
  });
