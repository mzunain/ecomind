# EcoMind 🌍

**AI-powered carbon footprint analyzer using Google Gemini**

Built for the [DEV Weekend Challenge: Earth Day Edition](https://dev.to/challenges/weekend-2026-04-16)

## Live Demo

🔗 https://ecomind-gamma.vercel.app

## What It Does

EcoMind lets you describe your daily lifestyle in plain language and returns a personalised carbon footprint analysis powered by the Google Gemini API. No rigid forms — just describe your commute, diet, home heating, and travel habits, and get back:

- **Estimated annual CO₂** in kg
- **Sustainability score** (1–10)
- **Top 5 reduction actions** ranked by impact with CO₂ savings per year
- **Regional context** — advice tailored to your location (Finland-aware by default)

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Google Gemini API** (`gemini-1.5-flash`) via `@google/generative-ai`
- **Structured JSON output** using Gemini's `responseSchema` feature
- **Tailwind CSS** for styling
- **Vercel** for deployment

## Getting Started

```bash
# Clone the repo
git clone https://github.com/mzunain/ecomind.git
cd ecomind

# Install dependencies
npm install

# Add your Gemini API key
echo 'GEMINI_API_KEY=your_key_here' > .env.local

# Run development server
npm run dev
```

Get a free Gemini API key at https://aistudio.google.com

## Key Technical Decision: Structured JSON Output

Instead of parsing free-form Gemini text responses, this project uses Gemini's `responseSchema` to enforce a strict JSON schema at the model level:

```typescript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: ecoAnalysisSchema,
  },
});
```

This guarantees reliable, parseable responses without regex or prompt engineering hacks.

## License

MIT
