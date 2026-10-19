import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Play,
  Pause,
  Square,
  Save,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { PowerBIProject, PhaseItem, Subtask, ProjectPhase } from '../types';

interface PowerBIProjectsProps {
  projects: PowerBIProject[];
  onUpdateProjects: (projects: PowerBIProject[]) => void;
}

const STANDARD_PHASES: ProjectPhase[] = [
  'Requirements',
  'Data Collection',
  'Data Cleaning',
  'Data Modeling',
  'DAX Measures',
  'Dashboard Design',
  'Validation',
  'Business Insights',
  'Documentation',
  'Portfolio Publication',
];

export const PowerBIProjects: React.FC<PowerBIProjectsProps> = ({
  projects,
  onUpdateProjects,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Stop-watch timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  // New subtask input state
  const [newSubtaskPhaseId, setNewSubtaskPhaseId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // New Project form state
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTarget, setNewProjTarget] = useState('2026-12-01');
  const [newProjPlannedHours, setNewProjPlannedHours] = useState(40);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

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
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSaveTimerSession = () => {
    if (timerSeconds < 30 || !activeProject) return;
    const loggedMinutes = Math.max(1, Math.round(timerSeconds / 60));
    const addedHours = Number((loggedMinutes / 60).toFixed(1));

    const updatedProjects = projects.map((p) => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          actualHours: Number((p.actualHours + addedHours).toFixed(1)),
          sessions: [
            ...(p.sessions || []),
            {
              id: `sess-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              durationMinutes: loggedMinutes,
              notes: sessionNotes || 'Focused Power BI modeling & DAX session',
            },
          ],
        };
      }
      return p;
    });

    onUpdateProjects(updatedProjects);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setSessionNotes('');
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 4000);
  };

  // Calculate real progress from subtasks
  const calculateRealProgress = (proj: PowerBIProject): number => {
    let totalSub = 0;
    let completedSub = 0;
    proj.phases.forEach((phase) => {
      phase.tasks.forEach((t) => {
        totalSub++;
        if (t.completed) completedSub++;
      });
    });
    if (totalSub === 0) return 0;
    return Math.round((completedSub / totalSub) * 100);
  };

  const handleToggleSubtask = (phaseId: string, subtaskId: string) => {
    if (!activeProject) return;
    const updatedPhases = activeProject.phases.map((phase) => {
      if (phase.id === phaseId) {
        const updatedTasks = phase.tasks.map((task) => {
          if (task.id === subtaskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        const allDone = updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);
        return { ...phase, tasks: updatedTasks, completed: allDone };
      }
      return phase;
    });

    const updated = projects.map((p) => {
      if (p.id === activeProject.id) {
        return { ...p, phases: updatedPhases };
      }
      return p;
    });
    onUpdateProjects(updated);
  };

  const handleAddSubtask = (phaseId: string) => {
    if (!newSubtaskTitle.trim() || !activeProject) return;
    const newTask: Subtask = {
      id: `task-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    const updatedPhases = activeProject.phases.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          completed: false,
          tasks: [...phase.tasks, newTask],
        };
      }
      return phase;
    });

    const updated = projects.map((p) => {
      if (p.id === activeProject.id) {
        return { ...p, phases: updatedPhases };
      }
      return p;
    });

    onUpdateProjects(updated);
    setNewSubtaskTitle('');
    setNewSubtaskPhaseId(null);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newPhases: PhaseItem[] = STANDARD_PHASES.map((name, i) => ({
      id: `phase-${i + 1}`,
      name,
      completed: false,
      tasks: [
        { id: `st-${i}-1`, title: `Complete ${name} milestones`, completed: false },
      ],
    }));

    const newProj: PowerBIProject = {
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      description: newProjDesc.trim() || 'New analytics portfolio project',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: newProjTarget,
      currentPhase: 'Requirements',
      plannedHours: newProjPlannedHours,
      actualHours: 0,
      notes: '',
      status: 'Active',
      portfolioStatus: 'Draft',
      phases: newPhases,
      sessions: [],
    };

    const updated = [...projects, newProj];
    onUpdateProjects(updated);
    setSelectedProjectId(newProj.id);
    setIsAddModalOpen(false);
    setNewProjName('');
    setNewProjDesc('');
  };

  const progress = activeProject ? calculateRealProgress(activeProject) : 0;

  return (
    <div className="space-y-6">
      {/* Header and Project Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Power BI Portfolio & Project Tracker</h2>
          <p className="text-xs text-slate-500">
            Track real progress across all 10 stages from requirements to portfolio publication
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Project selector dropdown */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-purple-600 focus:outline-hidden"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {activeProject && (
        <>
          {/* Project Overview Card + Real-Time Session Stop-Watch */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Project Specs */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900">{activeProject.name}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-purple-700">{activeProject.status}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">Portfolio: {activeProject.portfolioStatus}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeProject.description}
                </p>

                {/* Metrics Grid */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Current Phase</span>
                    <div className="mt-1 text-xs font-bold text-slate-900 truncate">
                      {activeProject.currentPhase}
                    </div>
                  </div>

                  <div className="rounded-xl bg-purple-50/60 p-3 border border-purple-100">
                    <span className="text-[11px] font-semibold text-purple-700">Real Progress</span>
                    <div className="mt-1 font-mono text-base font-bold text-purple-950 tabular-nums">
                      {progress}%
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Actual Hours</span>
                    <div className="mt-1 font-mono text-base font-bold text-slate-900 tabular-nums">
                      {activeProject.actualHours} hrs
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Target Hours</span>
                    <div className="mt-1 font-mono text-base font-bold text-slate-900 tabular-nums">
                      {activeProject.plannedHours} hrs
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Task Completion Ratio</span>
                  <span className="font-mono tabular-nums font-semibold text-purple-800">{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Work Timer */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/30 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-purple-900 mb-2">
                  <span className="font-bold flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-purple-700" />
                    Deep Work Timer
                  </span>
                  <span className="text-[11px] text-purple-700">Logs directly to hours</span>
                </div>

                <div className="mt-3 text-center">
                  <div className="font-mono text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                    {formatTimer(timerSeconds)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {isTimerRunning ? 'Session active · Stay focused' : 'Timer paused / ready'}
                  </div>
                </div>

                {/* Session Notes input */}
                <div className="mt-4">
                  <input
                    type="text"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Session notes (e.g. DAX margin measures)..."
                    className="w-full rounded-xl border border-purple-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2">
                  {!isTimerRunning ? (
                    <button
                      onClick={() => setIsTimerRunning(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-purple-700 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Start Session</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTimerRunning(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors cursor-pointer"
                    >
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause</span>
                    </button>
                  )}

                  <button
                    onClick={handleSaveTimerSession}
                    disabled={timerSeconds < 10}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save</span>
                  </button>
                </div>

                {savedAlert && (
                  <div className="rounded-lg bg-emerald-100 p-2 text-center text-xs font-semibold text-emerald-900">
                    Session successfully saved to project actual hours!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 10 Phases Breakdown and Subtasks */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Project Development Lifecycle</h3>
                <p className="text-xs text-slate-500">
                  Standard 10-phase roadmap for portfolio-grade BI reports
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {activeProject.phases.map((phase, pIdx) => (
                <div
                  key={phase.id}
                  className="rounded-xl border border-slate-200/70 bg-slate-50/40 p-4 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-purple-700 tabular-nums">
                        {String(pIdx + 1).padStart(2, '0')}.
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 sm:text-sm">{phase.name}</h4>
                      {phase.completed && (
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Phase Completed
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setNewSubtaskPhaseId(phase.id)}
                      className="text-[11px] font-semibold text-purple-700 hover:text-purple-900"
                    >
                      + Add Task
                    </button>
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-2 pl-6">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between text-xs text-slate-700 group hover:text-slate-900"
                      >
                        <button
                          onClick={() => handleToggleSubtask(phase.id, task.id)}
                          className="flex items-center gap-2 cursor-pointer text-left"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300 group-hover:text-purple-600 shrink-0" />
                          )}
                          <span className={task.completed ? 'line-through text-slate-400' : ''}>
                            {task.title}
                          </span>
                        </button>
                      </div>
                    ))}

                    {/* Inline add subtask form */}
                    {newSubtaskPhaseId === phase.id && (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={newSubtaskTitle}
                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                          placeholder="Task title..."
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs focus:border-purple-600 focus:outline-hidden"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddSubtask(phase.id);
                          }}
                        />
                        <button
                          onClick={() => handleAddSubtask(phase.id)}
                          className="rounded-lg bg-purple-700 px-3 py-1 text-xs font-semibold text-white"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setNewSubtaskPhaseId(null)}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* New Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create New Power BI Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Healthcare Patient Wait-Time Dashboard"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Business objective, KPIs, dataset size..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newProjTarget}
                    onChange={(e) => setNewProjTarget(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Planned Hours</label>
                  <input
                    type="number"
                    value={newProjPlannedHours}
                    onChange={(e) => setNewProjPlannedHours(parseInt(e.target.value, 10) || 40)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-700 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-800"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
