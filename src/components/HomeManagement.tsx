import React, { useState } from 'react';
import {
  Home,
  CheckCircle2,
  Circle,
  Plus,
  CloudSun,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  Utensils,
  Shirt,
  BookOpen,
} from 'lucide-react';
import { HouseholdTask, HouseholdCategory, WeatherData } from '../types';

interface HomeManagementProps {
  householdTasks: HouseholdTask[];
  onUpdateTasks: (tasks: HouseholdTask[]) => void;
  weather: WeatherData;
}

export const HomeManagement: React.FC<HomeManagementProps> = ({
  householdTasks,
  onUpdateTasks,
  weather,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HouseholdCategory>('Cooking');
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Selected Days'>('Daily');
  const [weatherSensitivity, setWeatherSensitivity] = useState<any>('Flexible');
  const [notes, setNotes] = useState('');

  const handleToggleTask = (id: string) => {
    const updated = householdTasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: HouseholdTask = {
      id: `home-${Date.now()}`,
      title: title.trim(),
      category,
      frequency,
      estimatedDuration: duration,
      priority,
      completed: false,
      weatherSensitivity,
      notes: notes.trim(),
    };

    onUpdateTasks([...householdTasks, newTask]);
    setIsAddModalOpen(false);
    setTitle('');
    setNotes('');
  };

  const categories: HouseholdCategory[] = [
    'Cooking',
    "Children's meals",
    'Laundry',
    'Cleaning',
    'Kitchen organization',
    'Tuition preparation',
    'Household errands',
  ];

  const filteredTasks = householdTasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  const completedCount = householdTasks.filter((t) => t.completed).length;
  const isRain = weather.precipitation > 0 || weather.weatherCode >= 50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Home & Family Management</h2>
          <p className="text-xs text-slate-500">
            Keep family responsibilities, meals, and tuition setup organized without feeling overwhelmed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-purple-200 bg-purple-50/60 px-3 py-1.5 text-xs text-purple-900">
            <span className="font-semibold">Today's Progress:</span>{' '}
            <span className="font-mono font-bold tabular-nums">
              {completedCount} / {householdTasks.length} done
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Routine Task</span>
          </button>
        </div>
      </div>

      {/* Weather Sensitivity Advisory */}
      {isRain && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 flex items-start gap-3">
          <CloudSun className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-sky-950">Rain Advisory for Lahore Chores: </span>
            <span className="text-sky-900">
              Outdoor line laundry is sensitive to precipitation today. We recommend using indoor drying racks or postponing heavy washing.
            </span>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Areas
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

      {/* Task List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No household tasks under this category.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-4 p-4 hover:bg-slate-50/70 transition-colors ${
                task.completed ? 'bg-slate-50/40 text-slate-400' : ''
              }`}
            >
              <button
                onClick={() => handleToggleTask(task.id)}
                className="mt-0.5 rounded-md p-1 text-slate-400 hover:text-purple-600 cursor-pointer transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 hover:text-purple-600" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-semibold sm:text-sm ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{task.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{task.frequency}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono">{task.estimatedDuration} mins</span>
                  {task.weatherSensitivity && task.weatherSensitivity !== 'Flexible' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 font-medium">{task.weatherSensitivity}</span>
                    </>
                  )}
                  {task.completed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">Completed</span>
                    </>
                  )}
                </div>

                {task.notes && (
                  <p className="mt-1 text-xs text-slate-500 leading-normal">{task.notes}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Household or Family Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sanitize student tuition desks and whiteboard"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HouseholdCategory)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Selected Days">Selected Days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Mins</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10) || 20)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weather Sensitivity</label>
                  <select
                    value={weatherSensitivity}
                    onChange={(e) => setWeatherSensitivity(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Flexible">Flexible</option>
                    <option value="Weather Sensitive">Weather Sensitive (Laundry)</option>
                    <option value="Indoor Alternative Available">Indoor Alternative Available</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Details, ingredients, or student prep..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
