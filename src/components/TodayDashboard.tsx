import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Plus,
  AlertCircle,
  CloudSun,
  ShieldAlert,
  ArrowRight,
  MoreVertical,
  Calendar,
  Trash2,
  Edit2,
  CalendarCheck,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { Task, WeatherData, TaskCategory, TaskPriority } from '../types';
import { checkScheduleOverlap, getKarachiCurrentTime } from '../utils/karachiTime';

interface TodayDashboardProps {
  tasks: Task[];
  weather: WeatherData;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveToTomorrow: (taskId: string) => void;
  onOpenPlanMyDay: () => void;
  onNavigateWeather: () => void;
  onNavigatePlanner: () => void;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({
  tasks,
  weather,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveToTomorrow,
  onOpenPlanMyDay,
  onNavigateWeather,
  onNavigatePlanner,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'fixed' | 'powerbi' | 'learning'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New task form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const [weatherSensitivity, setWeatherSensitivity] = useState<'Flexible' | 'Weather Sensitive' | 'Indoor Alternative Available' | 'Fixed'>('Flexible');
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingCount = totalCount - completedCount;

  // Find next upcoming task
  const timeInfo = getKarachiCurrentTime();
  const currentMinutes = timeInfo.hour * 60 + timeInfo.minute;

  const upcomingTask = tasks.find((t) => {
    if (t.completed) return false;
    const parts = t.startTime.split(':');
    const startM = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
    return startM >= currentMinutes - 30; // current or next
  }) || tasks.find((t) => !t.completed);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'fixed') return t.isFixed;
    if (filter === 'powerbi') return t.category === 'Power BI';
    if (filter === 'learning') return t.category === 'AI Automation';
    return true;
  });

  const checkOverlapOnInput = (newStart: string, newEnd: string, ignoreId?: string) => {
    const dummy = { id: ignoreId || 'new-temp', startTime: newStart, endTime: newEnd, title: 'New' };
    const collision = tasks.find((t) => {
      if (ignoreId && t.id === ignoreId) return false;
      return checkScheduleOverlap(dummy, t);
    });
    if (collision) {
      setOverlapWarning(`Notice: Overlaps with existing scheduled block "${collision.title}" (${collision.startTime}–${collision.endTime}).`);
    } else {
      setOverlapWarning(null);
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setCategory('Power BI');
    setStartTime('10:00');
    setEndTime('11:00');
    setPriority('Medium');
    setDuration(60);
    setNotes('');
    setIsFixed(false);
    setWeatherSensitivity('Flexible');
    setOverlapWarning(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setCategory(t.category);
    setStartTime(t.startTime);
    setEndTime(t.endTime);
    setPriority(t.priority);
    setDuration(t.estimatedDuration);
    setNotes(t.notes || '');
    setIsFixed(!!t.isFixed);
    setWeatherSensitivity(t.weatherSensitivity || 'Flexible');
    setOverlapWarning(null);
    setIsAddModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      const updated: Task = {
        ...editingTask,
        title: title.trim(),
        category,
        startTime,
        endTime,
        priority,
        estimatedDuration: duration,
        notes: notes.trim(),
        isFixed,
        weatherSensitivity,
      };
      onEditTask(updated);
    } else {
      const newTask: Task = {
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
        weatherSensitivity,
        date: new Date().toISOString().split('T')[0],
      };
      onAddTask(newTask);
    }

    setIsAddModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Completion */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Flow</span>
            <span className="font-mono text-xs font-bold text-purple-700 tabular-nums">
              {percentage}%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {completedCount}
            </span>
            <span className="text-xs text-slate-400">/ {totalCount} tasks completed</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Remaining Focus */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Remaining</span>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-500">tasks awaiting action</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Lahore Time: <span className="font-mono tabular-nums font-semibold text-slate-700">{timeInfo.timeStr}</span>
          </div>
        </div>

        {/* Card 3: Fixed commitments */}
        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-900">Protected Fixed Blocks</span>
            <span className="text-[11px] font-semibold text-purple-700">Protected</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
              <span>Tuition Academy</span>
              <span className="font-mono tabular-nums text-purple-800">3:00–6:00 PM</span>
            </div>
            <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
              <span>Live AI Class</span>
              <span className="font-mono tabular-nums text-purple-800">10:00 PM–12 AM</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-purple-700">
            Never moved or interrupted by auto-scheduling.
          </div>
        </div>

        {/* Card 4: Sleep Target Check */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900">Sleep Schedule</span>
            <Moon className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-amber-950 tabular-nums">5.0</span>
            <span className="text-xs text-amber-800">hrs planned (Target: 7–8 hrs)</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-amber-800 font-medium">Insufficient sleep alert</span>
            <button
              onClick={onOpenPlanMyDay}
              className="text-[11px] font-semibold text-purple-800 hover:text-purple-950 underline"
            >
              Optimize with AI
            </button>
          </div>
        </div>
      </div>

      {/* Up Next Banner & Weather Advisory Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Next Task Spotlight */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-purple-800 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                Current / Up Next Focus
              </span>
              {upcomingTask && (
                <span className="font-mono font-medium text-slate-600 tabular-nums">
                  {upcomingTask.startTime} – {upcomingTask.endTime} ({upcomingTask.estimatedDuration}m)
                </span>
              )}
            </div>
            {upcomingTask ? (
              <div className="mt-1">
                <h3 className="text-base font-bold text-slate-900">{upcomingTask.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{upcomingTask.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Priority: {upcomingTask.priority}</span>
                  {upcomingTask.notes && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-600 italic truncate max-w-sm">{upcomingTask.notes}</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-600 py-3">All scheduled tasks for today are completed! Great work, Sadaf.</div>
            )}
          </div>
          {upcomingTask && (
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => onToggleTask(upcomingTask.id)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Mark Complete</span>
              </button>
              <button
                onClick={() => onMoveToTomorrow(upcomingTask.id)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Move to Tomorrow
              </button>
            </div>
          )}
        </div>

        {/* Weather Quick Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CloudSun className="h-3.5 w-3.5 text-amber-500" />
                Lahore Weather
              </span>
              <button
                onClick={onNavigateWeather}
                className="text-[11px] font-semibold text-purple-700 hover:underline"
              >
                View Full Forecast →
              </button>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-slate-900 tabular-nums">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-slate-500">
                Feels like {weather.apparentTemperature}°C · {weather.weatherDescription}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {weather.precipitation > 0 || weather.weatherCode >= 50
                ? 'Rain expected: Keep laundry inside and focus on indoor Power BI analytics.'
                : weather.temperature >= 35
                ? 'High heat: Stay hydrated during 3–6 PM tuition classes; avoid mid-day outdoor errands.'
                : 'Pleasant weather in Lahore. Great conditions for your daily workflow.'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Humidity: {weather.humidity}% · Rain chance: {weather.precipitation > 0 ? 'High' : 'Low'}
          </div>
        </div>
      </div>

      {/* Main Task Timetable Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Timetable Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 p-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's Timetable</h2>
            <p className="text-xs text-slate-500">
              Interactive timeline structured in Pakistan Standard Time (Asia/Karachi)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center rounded-lg bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('fixed')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'fixed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fixed
              </button>
              <button
                onClick={() => setFilter('powerbi')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'powerbi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Power BI
              </button>
              <button
                onClick={() => setFilter('learning')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filter === 'learning' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Class
              </button>
            </div>

            {/* Add Task button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Timetable List */}
        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No tasks found for this filter.
            </div>
          ) : (
            filteredTasks.map((t) => {
              const isPast = false;
              return (
                <div
                  key={t.id}
                  className={`group flex items-start gap-4 p-4 transition-colors hover:bg-slate-50/70 ${
                    t.completed ? 'bg-slate-50/40 text-slate-400' : ''
                  }`}
                >
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => onToggleTask(t.id)}
                    className="mt-0.5 rounded-md p-1 text-slate-400 hover:text-purple-600 focus:outline-hidden transition-colors cursor-pointer"
                    aria-label={t.completed ? `Mark ${t.title} incomplete` : `Mark ${t.title} complete`}
                  >
                    {t.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 hover:text-purple-600" />
                    )}
                  </button>

                  {/* Time column */}
                  <div className="w-24 shrink-0 font-mono text-xs tabular-nums font-semibold text-slate-700">
                    <span className={t.completed ? 'line-through text-slate-400' : ''}>
                      {t.startTime} – {t.endTime}
                    </span>
                    <div className="text-[11px] font-normal text-slate-400">
                      {t.estimatedDuration}m
                    </div>
                  </div>

                  {/* Title and metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-semibold sm:text-sm ${
                          t.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {t.title}
                      </span>
                      {t.isFixed && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          Fixed Protected
                        </span>
                      )}
                    </div>

                    {/* Metadata line: Zero-pill discipline (unboxed text separated by ·) */}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{t.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={t.priority === 'Urgent' ? 'text-rose-600 font-semibold' : ''}>
                        {t.priority}
                      </span>
                      {t.weatherSensitivity && t.weatherSensitivity !== 'Flexible' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700">{t.weatherSensitivity}</span>
                        </>
                      )}
                      {t.completed && t.completedAt && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700">Done at {t.completedAt.split('T')[1]?.slice(0, 5) || 'today'}</span>
                        </>
                      )}
                    </div>

                    {t.notes && (
                      <p className="mt-1 text-xs text-slate-500 leading-normal">
                        {t.notes}
                      </p>
                    )}
                  </div>

                  {/* Row Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(t)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {!t.isFixed && (
                      <button
                        onClick={() => onMoveToTomorrow(t.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
                        title="Move to tomorrow"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {!t.isFixed && (
                      <button
                        onClick={() => setDeleteConfirmId(t.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingTask ? 'Edit Scheduled Task' : 'Add Task to Daily Timetable'}
            </h3>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build YoY DAX measures in Power BI"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Household">Household</option>
                    <option value="Children">Children</option>
                    <option value="Tuition Academy">Tuition Academy</option>
                    <option value="Power BI">Power BI</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Job Search">Job Search</option>
                    <option value="Client Outreach">Client Outreach</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Rest">Rest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      checkOverlapOnInput(e.target.value, endTime, editingTask?.id);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      checkOverlapOnInput(startTime, e.target.value, editingTask?.id);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10) || 30)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden tabular-nums"
                  />
                </div>
              </div>

              {/* Overlap alert warning */}
              {overlapWarning && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>{overlapWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weather Sensitivity
                  </label>
                  <select
                    value={weatherSensitivity}
                    onChange={(e) => setWeatherSensitivity(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Flexible">Flexible</option>
                    <option value="Weather Sensitive">Weather Sensitive (e.g. Laundry)</option>
                    <option value="Indoor Alternative Available">Indoor Alternative Available</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isFixed}
                      onChange={(e) => setIsFixed(e.target.checked)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Protected Fixed Commitment</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Details
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific goals, links, or worksheets to prep..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
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
                  {editingTask ? 'Save Changes' : 'Add to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Confirm Deletion</h4>
            <p className="mt-2 text-xs text-slate-600">
              Are you sure you want to permanently remove this scheduled task? This action cannot be undone.
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
                  if (deleteConfirmId) {
                    onDeleteTask(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }
                }}
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
