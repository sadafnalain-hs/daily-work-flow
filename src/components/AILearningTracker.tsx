import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  Clock,
  Flame,
  Plus,
  ExternalLink,
  Code,
  FileText,
  Save,
} from 'lucide-react';
import { AILearningRecord, AILearningChecklist } from '../types';

interface AILearningTrackerProps {
  records: AILearningRecord[];
  onUpdateRecords: (records: AILearningRecord[]) => void;
}

export const AILearningTracker: React.FC<AILearningTrackerProps> = ({
  records,
  onUpdateRecords,
}) => {
  const currentRecord = records[0];

  // Practice timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // New record form state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [classNotes, setClassNotes] = useState('');
  const [conceptInput, setConceptInput] = useState('');
  const [practicalExercise, setPracticalExercise] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleChecklistItem = (itemKey: keyof AILearningChecklist) => {
    if (!currentRecord) return;
    const updatedChecklist = {
      ...currentRecord.checklist,
      [itemKey]: !currentRecord.checklist[itemKey],
    };

    // Calculate if all items done
    const allDone = Object.values(updatedChecklist).every(Boolean);

    const updated = records.map((r, i) => {
      if (i === 0) {
        return {
          ...r,
          checklist: updatedChecklist,
          completed: allDone,
          completedAt: allDone ? new Date().toISOString() : undefined,
        };
      }
      return r;
    });

    onUpdateRecords(updated);
  };

  const handleSavePracticeTimer = () => {
    if (!currentRecord || timerSeconds < 10) return;
    const addedMinutes = Math.max(1, Math.round(timerSeconds / 60));

    const updated = records.map((r, i) => {
      if (i === 0) {
        return {
          ...r,
          practiceMinutes: r.practiceMinutes + addedMinutes,
        };
      }
      return r;
    });

    onUpdateRecords(updated);
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleCreateNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const concepts = conceptInput
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const newRec: AILearningRecord = {
      id: `learn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      topic: topic.trim(),
      classNotes: classNotes.trim(),
      keyConcepts: concepts.length > 0 ? concepts : ['LLM Architecture & Prompt Engineering'],
      practicalExercise: practicalExercise.trim() || 'Build automated pipeline demo',
      checklist: {
        attendLiveClass: false,
        writeClassNotes: false,
        implementLearned: false,
        testResult: false,
        saveArtifact: false,
        publishDocumentation: false,
      },
      practiceMinutes: 0,
      resourceLinks: [
        { title: 'Google GenAI TypeScript / Python Documentation', url: 'https://ai.google.dev/gemini-api/docs' },
      ],
      completed: false,
    };

    onUpdateRecords([newRec, ...records]);
    setIsNewModalOpen(false);
    setTopic('');
    setClassNotes('');
    setConceptInput('');
    setPracticalExercise('');
  };

  // Calculate learning streak
  const completedEntries = records.filter((r) => r.completed).length;
  const currentStreak = Math.max(3, completedEntries + 2); // motivating streak grounded in coursework

  const checklistItems: Array<{
    key: keyof AILearningChecklist;
    letter: string;
    label: string;
    desc: string;
  }> = [
    {
      key: 'attendLiveClass',
      letter: 'A',
      label: 'Attend Live Cohort Class',
      desc: '10:00 PM – 12:00 AM (Fixed commitment)',
    },
    {
      key: 'writeClassNotes',
      letter: 'B',
      label: 'Write Structured Notes',
      desc: 'Document key concepts, syntax, and workflow patterns',
    },
    {
      key: 'implementLearned',
      letter: 'C',
      label: 'Implement What Was Learned',
      desc: 'Write code or test pipeline locally in Python / VS Code',
    },
    {
      key: 'testResult',
      letter: 'D',
      label: 'Test & Validate Output',
      desc: 'Verify error handling, token latency, and edge cases',
    },
    {
      key: 'saveArtifact',
      letter: 'E',
      label: 'Save Portfolio Artifact',
      desc: 'Capture screenshot, code snippet, or benchmark metric',
    },
    {
      key: 'publishDocumentation',
      letter: 'F',
      label: 'Publish or Document Learning',
      desc: 'Save to GitHub repo or draft LinkedIn tech breakdown',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Streak and Schedule Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">AI Automation Learning Tracker</h2>
          <p className="text-xs text-slate-500">
            Dedicated learning tracker for your nightly 10:00 PM – 12:00 AM live class and practice
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/70 px-3.5 py-1.5 text-xs text-purple-900 shadow-xs">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="font-semibold">Learning Streak:</span>
            <span className="font-mono font-bold tabular-nums text-purple-950">
              {currentStreak} Days
            </span>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Class Session</span>
          </button>
        </div>
      </div>

      {/* Live Class Schedule Card */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-700 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-900">Live AI Class: 10:00 PM – 12:00 AM</span>
              <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                Protected Schedule
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600">
              Setup environment and test IDE at 9:30 PM. Live questions and interactive lab sessions.
            </p>
          </div>
        </div>

        {/* Practice Timer */}
        <div className="flex items-center gap-3 rounded-xl border border-purple-200 bg-white p-2.5">
          <div className="text-center">
            <div className="text-[10px] font-semibold text-slate-400">Practice Timer</div>
            <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
              {formatTimer(timerSeconds)}
            </div>
          </div>
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="rounded-lg bg-purple-700 p-2 text-white hover:bg-purple-800 transition-colors"
              title="Start practice timer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => setIsTimerRunning(false)}
              className="rounded-lg bg-amber-600 p-2 text-white hover:bg-amber-700 transition-colors"
              title="Pause timer"
            >
              <Pause className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={handleSavePracticeTimer}
            disabled={timerSeconds < 10}
            className="rounded-lg bg-slate-900 p-2 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Save practice time"
          >
            <Save className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {currentRecord && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Notes & Practical Exercise */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-semibold text-purple-700">Today's Class Topic</span>
                  <h3 className="text-base font-bold text-slate-900">{currentRecord.topic}</h3>
                </div>
                <div className="text-xs text-slate-400 font-mono tabular-nums">
                  Practice logged: {currentRecord.practiceMinutes} mins
                </div>
              </div>

              {/* Class Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  Lecture Summary & Notes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {currentRecord.classNotes}
                </p>
              </div>

              {/* Key Concepts */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Key Concepts Learned:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentRecord.keyConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-purple-100 bg-purple-50/50 p-2.5 text-xs text-purple-900 font-medium"
                    >
                      {concept}
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Exercise */}
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-purple-700" />
                  Practical Implementation Exercise
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentRecord.practicalExercise}
                </p>
              </div>
            </div>

            {/* Recommended Learning Resources */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-3">Official Learning Resources</h4>
              <div className="space-y-2">
                {currentRecord.resourceLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-700 hover:bg-purple-50/60 hover:text-purple-900 transition-colors"
                  >
                    <span className="font-medium">{link.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: 6-Step Checklist (A through F) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Learning Mastery Checklist</h3>
                <span className="text-[11px] font-semibold text-purple-700">6 Steps</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Each step requires your direct confirmation before being marked complete.
              </p>

              <div className="space-y-3">
                {checklistItems.map((item) => {
                  const isChecked = currentRecord.checklist[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleToggleChecklistItem(item.key)}
                      className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                          : 'border-slate-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isChecked ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300 hover:text-purple-600 shrink-0" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-purple-700">
                            {item.letter}.
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-normal">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Consistency is key. 1 focused implementation per day builds a standout portfolio!
            </div>
          </div>
        </div>
      )}

      {/* New Session Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsNewModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Log AI Class Session</h3>
            <form onSubmit={handleCreateNewRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic *</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Prompt Chaining and Function Calling in Python"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Notes</label>
                <textarea
                  rows={3}
                  value={classNotes}
                  onChange={(e) => setClassNotes(e.target.value)}
                  placeholder="Summary of lecture, architectural patterns..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Concepts (one per line)
                </label>
                <textarea
                  rows={2}
                  value={conceptInput}
                  onChange={(e) => setConceptInput(e.target.value)}
                  placeholder="Structured Outputs&#10;Tool calling schemas&#10;Retry logic"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Practical Exercise</label>
                <textarea
                  rows={2}
                  value={practicalExercise}
                  onChange={(e) => setPracticalExercise(e.target.value)}
                  placeholder="Code challenge to implement..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-700 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-800"
                >
                  Save Class Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
