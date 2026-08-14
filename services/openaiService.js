const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function extractPropertyFilters(message) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `
You are Homivo AI Advisor.

Convert the user's property search into JSON filters.

User:
${message}

Rules:
- PG / paying guest = PG
- hostel = HOSTEL
- room = ROOM
- boys / male = Male
- girls / female = Female
- co-living / anyone = Any
- "under 10000" = maxPrice 10000
- "10k" = 10000
- Never invent information.
- Return null when information is not provided.

Return JSON only.
`,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          city: {
            type: ["string", "null"],
          },
          locality: {
            type: ["string", "null"],
          },
          type: {
            type: ["string", "null"],
            enum: ["PG", "HOSTEL", "ROOM", null],
          },
          genderPreference: {
            type: ["string", "null"],
            enum: ["Male", "Female", "Any", null],
          },
          minPrice: {
            type: ["number", "null"],
          },
          maxPrice: {
            type: ["number", "null"],
          },
          amenities: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "city",
          "locality",
          "type",
          "genderPreference",
          "minPrice",
          "maxPrice",
          "amenities",
        ],
      },
    },
  });

  return JSON.parse(response.text);
}

async function generatePropertyResponse({
  userMessage,
  filters,
  properties,
}) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: `
You are Homivo AI Advisor.

User request:
${userMessage}

Search filters:
${JSON.stringify(filters)}

Properties found in MongoDB:
${JSON.stringify(properties)}

Give a short helpful response.

Rules:
- Only talk about the properties provided.
- Never invent properties.
- Never invent prices or amenities.
- If no properties were found, say so.
- Mention the number of properties found.
`,

    config: {
      temperature: 0.3,
    },
  });

  return response.text;
}

module.exports = {
  extractPropertyFilters,
  generatePropertyResponse,
};