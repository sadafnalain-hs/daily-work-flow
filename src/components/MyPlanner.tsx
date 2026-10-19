import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Plus,
  AlertTriangle,
  Moon,
  Sparkles,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Edit2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Task, TaskCategory, TaskPriority } from '../types';
import { checkScheduleOverlap } from '../utils/karachiTime';

interface MyPlannerProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveToTomorrow: (taskId: string) => void;
  onApplyBalancedSleepSchedule: () => void;
}

export const MyPlanner: React.FC<MyPlannerProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveToTomorrow,
  onApplyBalancedSleepSchedule,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sleepOptimizedAlert, setSleepOptimizedAlert] = useState(false);

  // New/edit form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Power BI');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [duration, setDuration] = useState(120);
  const [notes, setNotes] = useState('');
  const [isFixed, setIsFixed] = useState(false);

  // Check conflicts
  const conflicts: Array<{ taskA: Task; taskB: Task }> = [];
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (checkScheduleOverlap(tasks[i], tasks[j])) {
        conflicts.push({ taskA: tasks[i], taskB: tasks[j] });
      }
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  const categories: TaskCategory[] = [
    'Personal',
    'Household',
    'Children',
    'Tuition Academy',
    'Power BI',
    'Data Analytics',
    'AI Automation',
    'Job Search',
    'Client Outreach',
    'Social Media',
    'Rest',
  ];

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTitle('');
    setCategory('Power BI');
    setStartTime('10:00');
    setEndTime('12:00');
    setPriority('Medium');
    setDuration(120);
    setNotes('');
    setIsFixed(false);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setCategory(t.category);
    setStartTime(t.startTime);
    setEndTime(t.endTime);
    setPriority(t.priority);
    setDuration(t.estimatedDuration);
    setNotes(t.notes || '');
    setIsFixed(!!t.isFixed);
    setIsAddOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onEditTask({
        ...editingTask,
        title: title.trim(),
        category,
        startTime,
        endTime,
        priority,
        estimatedDuration: duration,
        notes: notes.trim(),
        isFixed,
      });
    } else {
      onAddTask({
        id: `task-${Date.now()}`,
        title: title.trim(),
        category,
        startTime,
        endTime,
        priority,
        estimatedDuration: duration,
        notes: notes.trim(),
        completed: false,
        status: 'Pending',
        isFixed,
        date: new Date().toISOString().split('T')[0],
      });
    }

    setIsAddOpen(false);
    setEditingTask(null);
  };

  const handleOptimizeSleep = () => {
    onApplyBalancedSleepSchedule();
    setSleepOptimizedAlert(true);
    setTimeout(() => setSleepOptimizedAlert(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: View selector & conflict/sleep health indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Master Schedule & Planner</h2>
          <p className="text-xs text-slate-500">
            Full view of daily blocks, protected commitments, and sleep health
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Week / Month toggle */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setViewMode('day')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                viewMode === 'day' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month View
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-lg bg-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Sleep Health Advisory Box */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-amber-950 sm:text-sm">
                  Sleep Target & Wellbeing Analysis
                </h3>
                <span className="text-[11px] font-semibold text-amber-700">5.0 hrs vs 7.5 hrs target</span>
              </div>
              <p className="mt-1 text-xs text-amber-900/90 leading-relaxed max-w-2xl">
                Adults require 7–9 hours of sleep. Maintaining a 3:00 AM – 8:00 AM window long-term causes cognitive fatigue.
                We recommend moving your 1:30 AM social media post creation to daytime and wrapping up AI practice by 12:45 AM.
              </p>
            </div>
          </div>

          <button
            onClick={handleOptimizeSleep}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-900 transition-colors shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-200" />
            <span>Apply 7-Hour Sleep Schedule</span>
          </button>
        </div>

        {sleepOptimizedAlert && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-100 p-2.5 text-xs font-semibold text-emerald-900">
            <Check className="h-4 w-4 text-emerald-700" />
            <span>Schedule successfully optimized! Social media moved to daytime and sleep adjusted to 7 hours.</span>
          </div>
        )}
      </div>

      {/* Conflict / Overlap Warnings */}
      {conflicts.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900 mb-1">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>Scheduling Overlap Detected ({conflicts.length})</span>
          </div>
          <div className="space-y-1 text-xs text-rose-800">
            {conflicts.map((c, i) => (
              <div key={i}>
                • "{c.taskA.title}" ({c.taskA.startTime}–{c.taskA.endTime}) collides with "{c.taskB.title}" ({c.taskB.startTime}–{c.taskB.endTime}).
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* View Content */}
      {viewMode === 'day' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Daily Pakistan Standard Time Timeline</span>
            <span className="tabular-nums font-mono text-slate-500">{filteredTasks.length} blocks scheduled</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`flex items-start gap-4 p-4 hover:bg-slate-50/70 transition-colors ${
                  t.completed ? 'bg-slate-50/30 text-slate-400' : ''
                }`}
              >
                <button
                  onClick={() => onToggleTask(t.id)}
                  className="mt-0.5 rounded-md p-1 text-slate-400 hover:text-purple-600 transition-colors"
                >
                  {t.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 hover:text-purple-600" />
                  )}
                </button>

                <div className="w-24 shrink-0 font-mono text-xs font-semibold tabular-nums text-slate-700">
                  <span className={t.completed ? 'line-through text-slate-400' : ''}>
                    {t.startTime} – {t.endTime}
                  </span>
                  <div className="text-[11px] font-normal text-slate-400">{t.estimatedDuration}m</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold sm:text-sm ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {t.title}
                    </span>
                    {t.isFixed && (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                        Fixed Protected
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{t.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Priority: {t.priority}</span>
                    {t.notes && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 truncate max-w-sm">{t.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                    title="Edit task"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  {!t.isFixed && (
                    <button
                      onClick={() => setDeleteConfirmId(t.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      title="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Weekly Schedule Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
              <div key={day} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs">
                <div className="font-bold text-slate-800 pb-2 border-b border-slate-200 mb-2">{day}</div>
                <div className="space-y-2">
                  <div className="rounded bg-purple-100/70 p-1.5 text-[11px] text-purple-900 font-medium">
                    10 AM: Power BI Deep Work
                  </div>
                  <div className="rounded bg-sky-100/70 p-1.5 text-[11px] text-sky-900 font-medium">
                    3–6 PM: Tuition Academy
                  </div>
                  <div className="rounded bg-indigo-100/70 p-1.5 text-[11px] text-indigo-900 font-medium">
                    10 PM–12 AM: Live AI Class
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'month' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">October 2026 Monthly Calendar</h3>
            <span className="text-xs text-slate-500">Lahore, Pakistan</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="py-1 font-bold text-slate-500">{d}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
              <div
                key={date}
                className={`min-h-[64px] rounded-lg border border-slate-100 p-1.5 text-left transition-colors hover:bg-purple-50/40 ${
                  date === 18 ? 'bg-purple-50 border-purple-200 font-bold' : 'bg-slate-50/30'
                }`}
              >
                <span className="text-[11px] text-slate-700">{date}</span>
                {date % 2 === 0 && (
                  <div className="mt-1 text-[9px] font-medium text-purple-700 truncate">
                    Urban Mart DAX
                  </div>
                )}
                {date % 3 === 0 && (
                  <div className="text-[9px] font-medium text-sky-700 truncate">
                    Tuition Batch
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingTask ? 'Edit Task' : 'Add New Scheduled Task'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10) || 30)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-700 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-800"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Delete Task</h4>
            <p className="mt-2 text-xs text-slate-600">
              Permanently delete this item from your master planner?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTask(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
