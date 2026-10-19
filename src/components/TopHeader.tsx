import React, { useEffect, useState } from 'react';
import { Menu, Sparkles, CloudSun, Clock } from 'lucide-react';
import { WeatherData } from '../types';
import { getKarachiCurrentTime } from '../utils/karachiTime';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenPlanMyDay: () => void;
  onNavigateWeather: () => void;
  weather: WeatherData;
  completedTasks: number;
  totalTasks: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileMenu,
  onOpenPlanMyDay,
  onNavigateWeather,
  weather,
  completedTasks,
  totalTasks,
}) => {
  const [currentTimeInfo, setCurrentTimeInfo] = useState(getKarachiCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeInfo(getKarachiCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      {/* Left zone: Mobile toggle & personalized greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-sm font-bold text-slate-900 sm:text-base">
            {currentTimeInfo.greeting}, Sadaf
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{currentTimeInfo.dateStr}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums text-slate-700">
              <Clock className="h-3 w-3 text-slate-400" />
              {currentTimeInfo.timeStr} PKT
            </span>
          </div>
        </div>
      </div>

      {/* Right zone: Weather, Progress summary, and "Plan My Day" button */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Weather chip button */}
        <button
          onClick={onNavigateWeather}
          className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
          title="Click to view detailed Lahore weather forecast"
        >
          <CloudSun className="h-4 w-4 text-amber-500" />
          <span className="font-medium">Lahore</span>
          <span className="font-mono tabular-nums font-semibold">{weather.temperature}°C</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 truncate max-w-[100px]">{weather.weatherDescription}</span>
        </button>

        {/* Task progress info */}
        <div className="hidden sm:flex flex-col items-end text-xs">
          <div className="font-medium text-slate-800">
            <span className="font-mono tabular-nums font-semibold text-purple-700">
              {completedTasks}
            </span>
            <span className="text-slate-400">/</span>
            <span className="font-mono tabular-nums">{totalTasks}</span>
            <span className="ml-1 text-slate-500">completed</span>
          </div>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {totalTasks - completedTasks} remaining · {percentage}%
          </span>
        </div>

        {/* "Plan My Day" button */}
        <button
          onClick={onOpenPlanMyDay}
          className="flex items-center gap-2 rounded-lg bg-purple-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 active:bg-purple-900 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-200" />
          <span>Plan My Day</span>
        </button>
      </div>
    </header>
  );
};
