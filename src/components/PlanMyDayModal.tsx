import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  CloudSun,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Task, WeatherData } from '../types';

interface PlanMyDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  weather: WeatherData;
  onApplyPlanChanges?: (updatedTasks: Task[]) => void;
}

interface PlanResponse {
  summary: string;
  actionPlan: string[];
  sleepAdvice: string;
  weatherNote: string;
  suggestedMoves: Array<{
    taskTitle: string;
    suggestedTime: string;
    reason: string;
  }>;
}

export const PlanMyDayModal: React.FC<PlanMyDayModalProps> = ({
  isOpen,
  onClose,
  tasks,
  weather,
  onApplyPlanChanges,
}) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlanResponse | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const fixedTasks = tasks.filter((t) => t.isFixed);

  const handleGenerate = async (customPrompt?: string) => {
    setIsLoading(true);
    setApplied(false);

    try {
      const response = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: customPrompt || userPrompt,
          currentSchedule: incompleteTasks.map((t) => ({
            id: t.id,
            title: t.title,
            time: `${t.startTime} - ${t.endTime}`,
            category: t.category,
            isFixed: t.isFixed,
          })),
          weather: {
            temperature: weather.temperature,
            precipitation: weather.precipitation,
            condition: weather.weatherDescription,
            weatherCode: weather.weatherCode,
          },
          sleepHours: 5,
        }),
      });

      const data = await response.json();
      if (data.plan) {
        setResult(data.plan);
        setIsAiGenerated(data.aiGenerated);
      }
    } catch (err) {
      console.error('Plan generation failed:', err);
      // Fallback display
      setResult({
        summary:
          "Good day Sadaf! Let's protect your tuition and AI class while ensuring you get sufficient rest tonight.",
        actionPlan: [
          'Dedicate 10 AM–12 PM exclusively to Power BI DAX modeling for the Urban Mart project.',
          'Protect Tuition Academy (3:00–6:00 PM) and prep student worksheets at 2:45 PM.',
          'Live AI Automation Class runs 10:00 PM–12:00 AM (Fixed commitment).',
          'Shift late night 1:30 AM social media creation to tomorrow afternoon so you can sleep earlier.',
        ],
        sleepAdvice:
          'Your current schedule plans only 5 hours of sleep (3:00 AM – 8:00 AM). Shift practice/social media to daytime to achieve 7–8 hours of restorative rest.',
        weatherNote:
          weather.precipitation > 0
            ? 'Rain expected in Lahore today: Hang laundry indoors and focus on indoor data modeling.'
            : 'Lahore weather is stable. Take a brief hydration break between student lessons.',
        suggestedMoves: [
          {
            taskTitle: 'Social media content creation and publishing',
            suggestedTime: 'Tomorrow at 12:00 PM',
            reason: 'Saves 90 minutes of night-time fatigue and protects your sleep.',
          },
        ],
      });
      setIsAiGenerated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyScheduleAdjustment = () => {
    if (!onApplyPlanChanges || !result) return;

    // Reschedule late night tasks to earlier or next day to protect sleep
    const updated = tasks.map((t) => {
      if (t.id === 'task-17') {
        // Social media creation
        return {
          ...t,
          startTime: '12:00',
          endTime: '12:30',
          notes: 'Rescheduled via LifeFlow AI to daytime to protect 7-hour sleep window',
        };
      }
      if (t.id === 'task-18') {
        // Sleep block expanded from 01:30 to 08:00 = 6.5 hours!
        return {
          ...t,
          startTime: '01:00',
          endTime: '08:00',
          estimatedDuration: 420,
          title: 'Sleep & Night Recovery (Optimized: 7.0 hours)',
          notes: 'Healthy sleep target achieved by moving post-midnight work to daytime.',
        };
      }
      return t;
    });

    onApplyPlanChanges(updated);
    setApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-purple-50/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Smart Daily LifeFlow AI Planner
              </h2>
              <p className="text-xs text-slate-500">
                Pacing your Power BI projects, tuition, AI classes, and family life in Lahore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Context Pill */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <div className="text-[11px] font-semibold text-slate-500">Incomplete Tasks</div>
              <div className="mt-1 text-base font-bold text-slate-900 tabular-nums">
                {incompleteTasks.length} tasks
              </div>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3">
              <div className="text-[11px] font-semibold text-purple-700">Fixed Commitments</div>
              <div className="mt-1 text-xs font-semibold text-purple-900">
                Tuition (3–6 PM) · AI Class (10 PM)
              </div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
              <div className="text-[11px] font-semibold text-amber-700">Planned Sleep Target</div>
              <div className="mt-1 text-base font-bold text-amber-900 tabular-nums">
                5 hrs (Deficit)
              </div>
            </div>
          </div>

          {/* User input area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              What does your day look like? (Optional custom request)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. I have an AI class tonight, 2 job applications, laundry, and Power BI work..."
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-purple-600 focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-purple-700 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-800 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Optimize Day</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setUserPrompt('Protect my 3-6 PM tuition and prioritize Power BI DAX and 7-hour sleep.');
                  handleGenerate('Protect my 3-6 PM tuition and prioritize Power BI DAX and 7-hour sleep.');
                }}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Prioritize sleep & DAX
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserPrompt('Rain is expected in Lahore; optimize indoor chores and outreach.');
                  handleGenerate('Rain is expected in Lahore; optimize indoor chores and outreach.');
                }}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Rainy day adjustments
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserPrompt('Heavy workload: 2 job applications and live AI lecture.');
                  handleGenerate('Heavy workload: 2 job applications and live AI lecture.');
                }}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Heavy job search day
              </button>
            </div>
          </div>

          {/* AI / Optimization Result Card */}
          {result && (
            <div className="space-y-4 rounded-xl border border-purple-100 bg-purple-50/30 p-5">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-900">
                    Recommended Day Strategy
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isAiGenerated ? '· Powered by Gemini 3.8 Flash' : '· Rule-based LifeFlow Engine'}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs leading-relaxed text-slate-700 font-medium">
                {result.summary}
              </p>

              {/* Action plan */}
              <div>
                <h4 className="text-xs font-semibold text-slate-800 mb-2">Priority Action Plan:</h4>
                <ul className="space-y-1.5">
                  {result.actionPlan.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-600 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sleep Advisory */}
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-amber-900">Sleep Health Guidance: </span>
                  <span className="text-amber-800">{result.sleepAdvice}</span>
                </div>
              </div>

              {/* Weather Note */}
              <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50/70 p-3">
                <CloudSun className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-sky-900">Lahore Weather Note: </span>
                  <span className="text-sky-800">{result.weatherNote}</span>
                </div>
              </div>

              {/* Suggested Moves */}
              {result.suggestedMoves && result.suggestedMoves.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 mb-2">
                    Recommended Schedule Adjustments:
                  </h4>
                  <div className="space-y-2">
                    {result.suggestedMoves.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 bg-white p-3 text-xs"
                      >
                        <div className="font-semibold text-slate-900">{m.taskTitle}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-purple-700 font-medium">
                          <span>Shift to:</span>
                          <span className="font-semibold">{m.suggestedTime}</span>
                        </div>
                        <p className="mt-1 text-slate-500">{m.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500">
                  Fixed blocks (Tuition 3–6 PM & AI Class 10 PM) are strictly preserved.
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Keep Current Timetable
                  </button>
                  {onApplyPlanChanges && (
                    <button
                      onClick={handleApplyScheduleAdjustment}
                      disabled={applied}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-800 disabled:bg-emerald-600 transition-colors"
                    >
                      {applied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Schedule Adjusted!</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-3.5 w-3.5" />
                          <span>Apply Recommendations</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
