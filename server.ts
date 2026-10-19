import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Check valid Gemini key (exclude placeholder values)
const apiKey = process.env.GEMINI_API_KEY;
const hasValidGeminiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10);

let aiClient: GoogleGenAI | null = null;
if (hasValidGeminiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Smart Daily AI Planner endpoint
app.post('/api/gemini/plan', async (req: Request, res: Response) => {
  const { userPrompt, currentSchedule, weather, sleepHours } = req.body;

  const systemInstruction = `You are the empathetic, expert life and productivity coach for Sadaf, a junior Data Analyst based in Lahore, Pakistan.
Sadaf's context:
- She teaches tuition classes at home from 3:00 PM to 6:00 PM (PROTECTED FIXED COMMITMENT - CANNOT BE MOVED).
- She attends a live AI Automation class from 10:00 PM to 12:00 AM midnight (PROTECTED FIXED COMMITMENT - CANNOT BE MOVED).
- She is currently sleeping only 5 hours (3 AM to 8 AM), which is insufficient for an adult. Always recommend steps toward a healthy 7-8 hour target without judging her.
- She works on Excel and Power BI projects (like Urban Mart), searches for remote jobs, sends outreach emails, and creates social media content.
- Weather in Lahore impacts outdoor chores (like laundry) and extreme afternoon heat demands indoor pacing.

Your goal:
Review her input and current tasks. Provide:
1. "summary": A warm, encouraging 2-sentence summary of how to tackle today.
2. "actionPlan": List of 3-5 specific, practical scheduling recommendations.
3. "sleepAdvice": Gentle recommendation regarding rest and when she can shift late-night tasks to daytime.
4. "weatherNote": Any advisory note based on Lahore's temperature/rain.
5. "suggestedMoves": Array of tasks that can be postponed or rescheduled, with { taskId?: string, taskTitle: string, suggestedTime: string, reason: string }.
Output valid JSON only.`;

  if (aiClient && hasValidGeminiKey) {
    try {
      const prompt = `User request: "${userPrompt || 'Plan and optimize my schedule for today.'}"
Current incomplete tasks count and timetable: ${JSON.stringify(currentSchedule || [])}
Current Lahore weather: ${JSON.stringify(weather || { temp: 28, condition: 'Clear' })}
Current planned sleep: ${sleepHours || 5} hours.`;

      const aiPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
      );

      const response = await Promise.race([aiPromise, timeoutPromise]);
      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, aiGenerated: true, plan: parsed });
      }
    } catch (apiError: any) {
      console.warn('Gemini API call skipped or timed out, using rule-based fallback:', apiError?.message);
    }
  }

  // Rule-based fallback scheduler ensuring zero failure state
  const isRain = weather && (weather.precipitation > 0 || weather.weatherCode >= 50);
  const isHighHeat = weather && weather.temperature >= 35;

  const plan = {
    summary:
      "Good day Sadaf! Your day is well-structured, but your 5-hour sleep window requires care. Let's protect your 3–6 PM tuition and 10 PM–12 AM live AI class while pacing your energy.",
    actionPlan: [
      'Protect your 10:00 AM–12:00 PM Power BI deep work session for DAX measures.',
      'During 12:30–1:30 PM, focus exclusively on shortlisting 2 remote roles accepting Pakistan applicants.',
      'Tuition Academy (3:00–6:00 PM) is fully locked in—prep worksheets 15 minutes before.',
      'Shift your post-midnight 1:30 AM social media content creation to an afternoon break or alternate days.',
    ],
    sleepAdvice:
      'Current sleep (3:00 AM – 8:00 AM = 5 hrs) is below your 7.5h target. Try wrapping up your AI class practice by 12:45 AM and sleeping by 1:00 AM to gain 2 extra hours of restorative sleep.',
    weatherNote: isRain
      ? 'Rain expected in Lahore today: Hang laundry indoors and focus on your Power BI model.'
      : isHighHeat
      ? 'Afternoon heat is elevated: Keep cool during 3 PM tuition and stay hydrated.'
      : 'Lahore weather looks pleasant today. Enjoy a brief screen-free break in the early evening.',
    suggestedMoves: [
      {
        taskTitle: 'Social media content creation and publishing',
        suggestedTime: 'Tomorrow 12:00 PM (Batch create 2 posts)',
        reason: 'Prevents 1:30 AM–3:00 AM late-night screen fatigue and unlocks 90 minutes of sleep tonight.',
      },
      {
        taskTitle: 'Practical implementation of AI class concepts',
        suggestedTime: 'Tomorrow morning 10:00 AM or shorten to 45 mins tonight',
        reason: 'Conserves mental energy so you wake up refreshed for family and portfolio work.',
      },
    ],
  };

  return res.json({ success: true, aiGenerated: false, plan });
});

// AI Email Outreach Assistant endpoint
app.post('/api/gemini/outreach', async (req: Request, res: Response) => {
  const { contactName, company, role, relevantNeed, personalizationNotes } = req.body;

  if (aiClient && hasValidGeminiKey) {
    try {
      const prompt = `Write a concise, high-converting cold outreach email for Sadaf Nalain, a Junior Data Analyst based in Lahore, Pakistan.
Recipient:
Name: ${contactName || 'Hiring Manager'}
Company: ${company || 'Analytics Team'}
Role: ${role || 'Lead'}
Business Need: ${relevantNeed || 'Excel to Power BI dashboard migration / Junior Data Analyst opportunity'}
Notes to personalize: ${personalizationNotes || 'Mention portfolio link and clean star schema design'}

Format instructions:
Return JSON with 'subject' and 'body'. The tone must be humble, professional, clear, and highlight real value (Power BI, DAX, Excel automation). Do NOT invent fake previous employment or awards.`;

      const aiPromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Outreach generation timeout')), 4500)
      );

      const response = await Promise.race([aiPromise, timeoutPromise]);
      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, aiGenerated: true, email: parsed });
      }
    } catch (err: any) {
      console.warn('Gemini outreach generation error, falling back:', err?.message);
    }
  }

  // Fallback template
  return res.json({
    success: true,
    aiGenerated: false,
    email: {
      subject: `Power BI & Excel Dashboards | Quick intro for ${company || 'your team'}`,
      body: `Hi ${contactName || 'there'},

I hope your week is off to a great start.

I came across ${company || 'your organization'} and noticed your focus on data-driven operations. As a Junior Data Analyst based in Lahore specializing in Power BI and Excel, I help teams convert complex, disconnected spreadsheets into automated, interactive executive dashboards.

I recently completed an end-to-end retail performance dashboard covering $4.2M in sales, star-schema data modeling, and automated YoY DAX measures.

${personalizationNotes ? `Note: ${personalizationNotes}\n\n` : ''}Would you be open to a quick 5-minute chat or seeing a sample interactive report?

Best regards,
Sadaf Nalain
Junior Data Analyst | Lahore, Pakistan`,
    },
  });
});

// Boot dev server with Vite middlewares or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sadaf's LifeFlow AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
