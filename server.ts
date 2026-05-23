import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY" && API_KEY.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized GoogleGenAI with API Key.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY env variable found. Using high-fidelity local AI rules engine as fallback.");
}

// 1. RECOMMEND ENDPOINT
app.post("/api/recommend", async (req, res) => {
  const { occasion, personality, emotion, customMessage } = req.body;

  const resolvedEmotion = customMessage || emotion || "Love & Appreciation";

  // If Gemini is available, use it!
  if (ai) {
    try {
      const prompt = `You are a professional luxury florist and psychologist specialized in elegant Korean-style bouquet design.
Generate flower, wrapping, color theme, and note recommendations based on these customer request parameters:
- Occasion: ${occasion}
- Recipient Personality Type: ${personality}
- Intended Emotion/Message: "${resolvedEmotion}"

Return a valid JSON object matching this schema:
{
  "recommendedFlowers": [
    { "typeId": "red-rose", "quantity": 9, "reason": "Red roses symbolize ultimate devotion and the quantity 9 means eternal connection." }
  ],
  "wrapperStyleId": "korean-wrap",
  "paletteId": "pastel-pink",
  "ribbonColor": "cream",
  "ribbonStyle": "satin",
  "emotionalPsychology": "A gentle dialogue between warm cream tones and blush petals that whispers comfort."
}

Ensure the flower typeIds only use these valid keys: 'red-rose', 'pink-rose', 'pink-tulip', 'white-lily', 'sunflower', 'lavender', 'blue-hydrangea', 'yellow-rose', 'white-daisy', 'carnation', 'orchid'.
Ensure wrapperStyleId is one of: 'korean-wrap', 'transparent-wrap', 'matte-pastel', 'luxury-satin', 'vintage-news', 'minimal-mono', 'glitter-wrap', 'soft-mesh'.
Ensure paletteId is one of: 'pastel-pink', 'lavender-dream', 'sage-minimal', 'luxury-black', 'peach-pastel', 'sunset-romance', 'blue-serenity'.

Your response MUST be strict raw JSON. Do not include markdown wraps (like \`\`\`json). Just the pure JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedFlowers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    typeId: { type: Type.STRING },
                    quantity: { type: Type.INTEGER },
                    reason: { type: Type.STRING },
                  },
                  required: ["typeId", "quantity", "reason"],
                }
              },
              wrapperStyleId: { type: Type.STRING },
              paletteId: { type: Type.STRING },
              ribbonColor: { type: Type.STRING },
              ribbonStyle: { type: Type.STRING },
              emotionalPsychology: { type: Type.STRING },
            },
            required: ["recommendedFlowers", "wrapperStyleId", "paletteId", "ribbonColor", "ribbonStyle", "emotionalPsychology"],
          },
          temperature: 0.7,
        }
      });

      const text = response.text?.trim() || "{}";
      const cleanedText = text.replace(/^```json/, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanedText);
      return res.json({ ...parsed, aiSource: "Gemini 3.5 AI" });

    } catch (err: any) {
      console.warn("Gemini recommendation error, falling back to rule engine:", err.message);
    }
  }

  // Pure rule-based premium florist fallback
  let flowers = [{ typeId: "pink-rose", quantity: 9, reason: "Pink Roses convey elegance, grace and deep sweet gratitude." }];
  let wrapper = "korean-wrap";
  let palette = "pastel-pink";
  let ribbonColor = "Cream Ivory";
  let ribbonStyle = "satin";
  let psychology = "A soft luxurious selection focusing on gentle pastel comfort and timeless beauty.";

  if (occasion === "birthday") {
    flowers = [
      { typeId: "sunflower", quantity: 5, reason: "Sunflowers bring sunshine, bright loyalty and glowing birthday joy." },
      { typeId: "yellow-rose", quantity: 6, reason: "Yellow roses express perfect bright friendship and new beginnings." }
    ];
    wrapper = "matte-pastel";
    palette = "peach-pastel";
    ribbonColor = "Golden Peach";
    psychology = "Radiates sunshine, warmth, and enthusiastic celebration of their beautiful presence.";
  } else if (occasion === "valentines" || occasion === "proposal") {
    flowers = [
      { typeId: "red-rose", quantity: 12, reason: "A pristine dozen Red Roses symbolizes ultimate romantic passion and eternal commitment." }
    ];
    wrapper = "korean-wrap";
    palette = "sunset-romance";
    ribbonColor = "Burgundy Red";
    psychology = "Expresses deep, passionate declaration of devotion, accented by heavy, romantic folds.";
  } else if (occasion === "thankyou" || occasion === "apology") {
    flowers = [
      { typeId: "white-lily", quantity: 3, reason: "White Lilies invite quiet peace, clean healing thoughts and restoration." },
      { typeId: "white-daisy", quantity: 8, reason: "White Daisies represent honest, humble sincerity and fresh starts." }
    ];
    wrapper = "transparent-wrap";
    palette = "sage-minimal";
    ribbonColor = "Sage Linen";
    psychology = "Brings deep organic clarity, calm, and soothing relief to emotional spaces.";
  } else if (occasion === "anniversary") {
    flowers = [
      { typeId: "pink-tulip", quantity: 10, reason: "Pink Tulips mean happy devotion and a heart that beats steadily with true love." },
      { typeId: "lavender", quantity: 12, reason: "Lavender adds scent of calm trust and quiet commitment." }
    ];
    wrapper = "luxury-satin";
    palette = "lavender-dream";
    ribbonColor = "Lavender Organza";
    psychology = "A luxury harmony mirroring a quiet bond built over beautiful years.";
  }

  // Adjust for personality
  if (personality === "minimalist") {
    wrapper = "minimal-mono";
    flowers = [flowers[0]]; // Simplify to a single focal flower variety for minimalism
  } else if (personality === "dark-academia") {
    wrapper = "vintage-news";
    palette = "luxury-black";
    ribbonColor = "Dark Charcoal";
  } else if (personality === "cute-playful") {
    wrapper = "soft-mesh";
  }

  return res.json({
    recommendedFlowers: flowers,
    wrapperStyleId: wrapper,
    paletteId: palette,
    ribbonColor,
    ribbonStyle,
    emotionalPsychology: psychology,
    aiSource: "Artisanal Standard"
  });
});

// 2. BOUQUET MEANING EXPLANATION ENDPOINT
app.post("/api/bouquet-meaning", async (req, res) => {
  const {
    flowers,
    size,
    occasion,
    personality,
    emotion,
    customMessage,
    wrappingStyle,
    paletteId,
    ribbonStyle,
    ribbonColor,
    noteMessage
  } = req.body;

  const resolvedEmotion = customMessage || emotion || "Quiet Happiness";

  if (ai) {
    try {
      const prompt = `You are an elite Korean-style floral designer and copywriter.
Generate an emotional design analysis and elegant naming suite for this specific customized bouquet:
- Flowers included: ${JSON.stringify(flowers)}
- Size option: ${size}
- Intended occasion: ${occasion}
- Recipient style profile: ${personality}
- Emotional intent: "${resolvedEmotion}"
- Wrap Style Selected: ${wrappingStyle}
- Palette theme selected: ${paletteId}
- Ribbon style: ${ribbonStyle} (${ribbonColor})
- Inside written note message: "${noteMessage}"

Generate a valid JSON object matching this schema:
{
  "poeticSummary": "A detailed, beautiful, highly personalized and flowing explanation of how these flowers and wrapper speak to their soul.",
  "bouquetName": "A sweet 2-3 word poetic name for this bouquet creation",
  "emotionalTitle": "A dramatic romantic branding tagline",
  "aestheticDescription": "A designer's summary of the delicate paper wrapping layering techniques and visual weights."
}

Ensure the tone is warm, comforting, poetic, luxurious, and reads like a letter.
Your response MUST be strict raw JSON. Do not include markdown wraps (like \`\`\`json). Just the pure JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              poeticSummary: { type: Type.STRING },
              bouquetName: { type: Type.STRING },
              emotionalTitle: { type: Type.STRING },
              aestheticDescription: { type: Type.STRING },
            },
            required: ["poeticSummary", "bouquetName", "emotionalTitle", "aestheticDescription"],
          },
          temperature: 0.8,
        }
      });

      const text = response.text?.trim() || "{}";
      const cleanedText = text.replace(/^```json/, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanedText);
      return res.json({ ...parsed, aiSource: "Gemini 3.5 Personalist" });

    } catch (err: any) {
      console.warn("Gemini meaning analysis error, falling back to local poetry engine:", err.message);
    }
  }

  // Beautiful handcrafted fallback generator based on configuration parameters
  let bouquetName = "Elysian Whispers";
  let emotionalTitle = "A Tender Bridge Over Whispered Words";
  let poeticSummary = "This custom bouquet gathers soft tones, combining premium symbolic petals to represent a delicate dialogue of tenderness. Configured elegantly in a soft wrap, it acts as a container for unspoken feelings, sending warmth to their spirit.";
  let aestheticDescription = "An outstanding showcase of Korean floral art. The design features soft organic ripples of paper, structured layers that give depth, and an off-center visual weight tied together by a raw satin ribbon.";

  const primaryFlower = flowers?.[0]?.typeId || "rose";

  if (primaryFlower.includes("rose")) {
    bouquetName = "Forever Blooming";
    emotionalTitle = "Whispering Everlasting Softness Voyage";
    poeticSummary = `Centered around romantic ${flowers?.[0]?.quantity || 9} premium Roses, this creation directly translates the language of '${resolvedEmotion}'. Each petal unfurls with gentle reassurance, crafted specifically for the ${personality} soul. Combined with the layered folds, it represents protection and steady respect.`;
  } else if (primaryFlower.includes("sunflower") || primaryFlower.includes("yellow")) {
    bouquetName = "Golden Hour Love";
    emotionalTitle = "A Sanctuary of Radiant Daylight";
    poeticSummary = `Flooded with golden sunflower nodes, this structure celebrates bright loyalty, cheer and gratitude. Ideal for a beautiful ${occasion} tribute, it lifts any dark corner and creates an instant Pinterest-worthy moment of glowing comfort.`;
    aestheticDescription = "A bold, asymmetrical rustic gather wrapped neatly in contrasting papers to emphasize the dramatic sunny crowns of the sunflowers.";
  } else if (primaryFlower.includes("lily") || primaryFlower.includes("daisy")) {
    bouquetName = "Softly Yours";
    emotionalTitle = "Quiet Grace and Untainted Reverie";
    poeticSummary = `Designed for deep organic serenity, this minimalist presentation uses pristine lilies and daisies. It serves as a gentle apology, a deep thank you, or a symbol of pure validation. The muted design palette radiates a secure, calming companionship.`;
  } else if (primaryFlower.includes("lavender") || primaryFlower.includes("hydrangea")) {
    bouquetName = "Lavender Twilight";
    emotionalTitle = "An Invitation to Peaceful Comfort";
    poeticSummary = `A comforting melody of deep lavenders and pastel blue accents. The calming fragrance and cool colors create a calming shelter from noise, speaking directly to those who values quiet, thoughtful notes of support.`;
  }

  return res.json({
    bouquetName,
    emotionalTitle,
    poeticSummary,
    aestheticDescription,
    aiSource: "Artisanal Studio fallback"
  });
});

// Setup Vite Dev server or Serve Static production bundles
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Serving in DEVELOPMENT mode with dynamic Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving in PRODUCTION mode with static file handler...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CustomBouquet server running stably on port ${PORT}`);
  });
}

startServer();
