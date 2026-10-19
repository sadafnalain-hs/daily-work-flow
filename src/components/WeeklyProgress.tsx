import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Briefcase,
  Mail,
  Share2,
  Home,
  Moon,
  Sparkles,
  Save,
  Calendar,
  Award,
} from 'lucide-react';
import {
  WeeklyGoal,
  SleepLog,
  Task,
  PowerBIProject,
  AILearningRecord,
  JobRecord,
  OutreachContact,
  SocialMediaPost,
  HouseholdTask,
} from '../types';

interface WeeklyProgressProps {
  weeklyGoal: WeeklyGoal;
  onUpdateGoal: (goal: WeeklyGoal) => void;
  sleepLogs: SleepLog[];
  tasks: Task[];
  projects: PowerBIProject[];
  learningRecords: AILearningRecord[];
  jobs: JobRecord[];
  outreach: OutreachContact[];
  socialPosts: SocialMediaPost[];
  householdTasks: HouseholdTask[];
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  weeklyGoal,
  onUpdateGoal,
  sleepLogs,
  tasks,
  projects,
  learningRecords,
  jobs,
  outreach,
  socialPosts,
  householdTasks,
}) => {
  // Real calculations
  const totalCompletedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const totalPowerBIHours = Number(
    projects.reduce((acc, p) => acc + (p.actualHours || 0), 0).toFixed(1)
  );

  const totalAILearningMinutes = learningRecords.reduce(
    (acc, r) => acc + (r.practiceMinutes || 0),
    0
  );
  const totalAILearningHours = Number((totalAILearningMinutes / 60).toFixed(1));

  const totalJobsApplied = jobs.filter((j) => j.status === 'Applied').length;
  const totalEmailsSent = outreach.filter((o) => o.status === 'Sent' || o.status === 'Replied').length;
  const totalPostsPublished = socialPosts.filter((s) => s.status === 'Published').length;

  const householdCompleted = householdTasks.filter((h) => h.completed).length;
  const householdTotal = householdTasks.length;
  const householdPercentage =
    householdTotal > 0 ? Math.round((householdCompleted / householdTotal) * 100) : 0;

  const avgSleepHours = Number(
    (sleepLogs.reduce((acc, s) => acc + s.hours, 0) / (sleepLogs.length || 1)).toFixed(1)
  );

  // Editable reflection form
  const [wentWell, setWentWell] = useState(weeklyGoal.reviewWhatWentWell);
  const [unfinished, setUnfinished] = useState(weeklyGoal.reviewUnfinished);
  const [projectProgress, setProjectProgress] = useState(weeklyGoal.reviewProjectProgress);
  const [nextPriority, setNextPriority] = useState(weeklyGoal.reviewNextWeekPriority);

  // Targets
  const [pbiTarget, setPbiTarget] = useState(weeklyGoal.powerBIHoursTarget);
  const [aiTarget, setAiTarget] = useState(weeklyGoal.aiLearningHoursTarget);
  const [jobsTarget, setJobsTarget] = useState(weeklyGoal.jobApplicationsTarget);
  const [emailsTarget, setEmailsTarget] = useState(weeklyGoal.outreachEmailsTarget);
  const [sleepTarget, setSleepTarget] = useState(weeklyGoal.sleepHoursTarget);

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WeeklyGoal = {
      ...weeklyGoal,
      powerBIHoursTarget: pbiTarget,
      aiLearningHoursTarget: aiTarget,
      jobApplicationsTarget: jobsTarget,
      outreachEmailsTarget: emailsTarget,
      sleepHoursTarget: sleepTarget,
      reviewWhatWentWell: wentWell,
      reviewUnfinished: unfinished,
      reviewProjectProgress: projectProgress,
      reviewNextWeekPriority: nextPriority,
    };
    onUpdateGoal(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Weekly Progress & Growth Review</h2>
          <p className="text-xs text-slate-500">
            Real metrics calculated directly from your logged hours, completed subtasks, and applications
          </p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/60 px-3.5 py-1.5 text-xs text-purple-900 shadow-xs">
          Week of {weeklyGoal.weekStartDate} · Asia/Karachi
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Power BI Hours */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Power BI Work</span>
            <span className="tabular-nums font-mono text-purple-700">
              {Math.min(100, Math.round((totalPowerBIHours / (weeklyGoal.powerBIHoursTarget || 1)) * 100))}%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {totalPowerBIHours}
            </span>
            <span className="text-xs text-slate-400">/ {weeklyGoal.powerBIHoursTarget} hrs</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Urban Mart & Financial Analysis</div>
        </div>

        {/* AI Learning Hours */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">AI Class Practice</span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {totalAILearningHours}
            </span>
            <span className="text-xs text-slate-400">/ {weeklyGoal.aiLearningHoursTarget} hrs</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Nightly code implementations</div>
        </div>

        {/* Job Applications */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Applications</span>
            <Briefcase className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {totalJobsApplied}
            </span>
            <span className="text-xs text-slate-400">/ {weeklyGoal.jobApplicationsTarget} roles</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Verified remote opportunities</div>
        </div>

        {/* Average Sleep Log */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-900">
            <span className="font-semibold">Avg Sleep</span>
            <Moon className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-amber-950 tabular-nums">
              {avgSleepHours}
            </span>
            <span className="text-xs text-amber-800">/ {weeklyGoal.sleepHoursTarget} hrs goal</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 font-medium">Needs daytime schedule shift</div>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Personalized Emails</div>
              <div className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {totalEmailsSent} Sent
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-400">Goal: {weeklyGoal.outreachEmailsTarget}</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Social Showcase Posts</div>
              <div className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {totalPostsPublished} Published
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-400">Goal: {weeklyGoal.socialPostsTarget}</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Household & Family Flow</div>
              <div className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {householdPercentage}% Complete
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-400">{householdCompleted}/{householdTotal}</span>
        </div>
      </div>

      {/* Sleep Log History Bar Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sleep Duration Log vs 7.5h Target</h3>
            <p className="text-xs text-slate-500">
              Visualizing night recovery hours across the past 5 recorded nights
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800">Target: 7.5 hrs</span>
        </div>

        <div className="space-y-3">
          {sleepLogs.map((log, idx) => {
            const widthPct = Math.min(100, Math.round((log.hours / 9) * 100));
            const isDeficit = log.hours < 6.5;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="w-20 font-mono text-slate-600 tabular-nums shrink-0">
                  {log.date.slice(5)}
                </span>
                <div className="flex-1 h-5 rounded-lg bg-slate-100 overflow-hidden relative">
                  <div
                    className={`h-full rounded-lg transition-all ${
                      isDeficit ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                  {/* 7.5h target marker line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                    style={{ left: `${(7.5 / 9) * 100}%` }}
                    title="7.5h Target"
                  />
                </div>
                <span className="w-14 font-mono font-bold text-slate-900 tabular-nums shrink-0">
                  {log.hours} hrs
                </span>
                <span className="text-slate-400 text-[11px] truncate hidden md:inline">
                  {log.notes}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Positive Weekly Review & Next Week Priorities Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <Award className="h-4 w-4 text-purple-700" />
          <h3 className="text-sm font-bold text-slate-900">Weekly Reflection & Strategic Planning</h3>
        </div>

        <form onSubmit={handleSaveReview} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                1. What went well this week?
              </label>
              <textarea
                rows={3}
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 leading-relaxed focus:border-purple-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                2. What remains unfinished or needs adjustment?
              </label>
              <textarea
                rows={3}
                value={unfinished}
                onChange={(e) => setUnfinished(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 leading-relaxed focus:border-purple-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                3. Which Power BI / AI project progressed most?
              </label>
              <textarea
                rows={3}
                value={projectProgress}
                onChange={(e) => setProjectProgress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 leading-relaxed focus:border-purple-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                4. What should be prioritized next week?
              </label>
              <textarea
                rows={3}
                value={nextPriority}
                onChange={(e) => setNextPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 leading-relaxed focus:border-purple-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Goal Targets Adjustment Row */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Adjust Next Week Targets</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-500">Power BI Hours</label>
                <input
                  type="number"
                  value={pbiTarget}
                  onChange={(e) => setPbiTarget(parseInt(e.target.value, 10) || 15)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs tabular-nums mt-0.5"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500">AI Practice Hours</label>
                <input
                  type="number"
                  value={aiTarget}
                  onChange={(e) => setAiTarget(parseInt(e.target.value, 10) || 12)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs tabular-nums mt-0.5"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500">Job Applications</label>
                <input
                  type="number"
                  value={jobsTarget}
                  onChange={(e) => setJobsTarget(parseInt(e.target.value, 10) || 10)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs tabular-nums mt-0.5"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500">Outreach Emails</label>
                <input
                  type="number"
                  value={emailsTarget}
                  onChange={(e) => setEmailsTarget(parseInt(e.target.value, 10) || 10)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs tabular-nums mt-0.5"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500">Sleep Target (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepTarget}
                  onChange={(e) => setSleepTarget(parseFloat(e.target.value) || 7.5)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs tabular-nums mt-0.5"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {savedAlert && (
              <span className="text-xs font-semibold text-emerald-700">
                Weekly review & targets saved!
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-800 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Weekly Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
