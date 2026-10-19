import React from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  Compass,
  AlertCircle,
  RefreshCw,
  Info,
  CheckCircle,
} from 'lucide-react';
import { WeatherData } from '../types';
import { getWeatherSuggestions } from '../utils/weather';

interface WeatherWidgetProps {
  weather: WeatherData;
  onRefreshWeather: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  onRefreshWeather,
}) => {
  const suggestions = getWeatherSuggestions(
    weather.temperature,
    weather.precipitation,
    weather.weatherCode
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Lahore Weather & Scheduling Guidance</h2>
          <p className="text-xs text-slate-500">
            Real-time atmospheric telemetry from Open-Meteo for Punjab, Pakistan (31.58°N, 74.33°E)
          </p>
        </div>

        <button
          onClick={onRefreshWeather}
          disabled={weather.isLoading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${weather.isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Weather</span>
        </button>
      </div>

      {/* Main Condition Billboard Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Temperature & Condition */}
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 shadow-xs">
              <CloudSun className="h-9 w-9" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                  {weather.temperature}°C
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  Feels like {weather.apparentTemperature}°C
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span>{weather.weatherDescription}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">Lahore, Punjab</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Droplets className="h-3.5 w-3.5 text-sky-500" />
                <span>Humidity</span>
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {weather.humidity}%
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CloudRain className="h-3.5 w-3.5 text-indigo-500" />
                <span>Precipitation</span>
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {weather.precipitation} mm
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Wind className="h-3.5 w-3.5 text-teal-500" />
                <span>Wind Speed</span>
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {weather.windSpeed} km/h
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Data source: Open-Meteo Forecast API (Asia/Karachi)</span>
          <span>Last updated: {weather.lastUpdated}</span>
        </div>
      </div>

      {/* Weather-Aware Advisory Suggestions */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-sky-700" />
          <h3 className="text-sm font-bold text-sky-950">
            Weather-Aware Task Guidance for Today
          </h3>
          <span className="text-[11px] text-sky-700 font-medium">Advisory Only</span>
        </div>
        <p className="text-xs text-sky-900/80 mb-3">
          Sadaf's LifeFlow AI analyzes current atmospheric conditions to recommend ideal windows for laundry, tuition comfort, and deep focus:
        </p>
        <div className="space-y-2">
          {suggestions.map((sug, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl border border-sky-100 bg-white p-3 text-xs text-slate-800"
            >
              <CheckCircle className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" />
              <span className="leading-relaxed">{sug}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next 12 Hours Forecast Strip */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Hourly Timeline (Next 12 Hours)</h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {weather.hourly.map((h, i) => {
            const timeLabel = h.time.includes('T') ? h.time.split('T')[1]?.slice(0, 5) : h.time;
            return (
              <div
                key={i}
                className="flex min-w-[80px] flex-col items-center rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center"
              >
                <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                  {timeLabel}
                </span>
                <CloudSun className="my-2 h-5 w-5 text-amber-500" />
                <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {h.temp}°C
                </span>
                <span className="mt-1 text-[10px] text-sky-600 font-medium tabular-nums">
                  {h.pop}% rain
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Outlook */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">5-Day Outlook for Lahore</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {weather.daily.map((d, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-center"
            >
              <div className="text-xs font-bold text-slate-700">
                {d.date.length > 5 ? d.date.slice(5) : d.date}
              </div>
              <CloudSun className="mx-auto my-2.5 h-6 w-6 text-amber-500" />
              <div className="flex items-center justify-center gap-1.5 font-mono text-xs tabular-nums">
                <span className="font-bold text-slate-900">{d.maxTemp}°</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-500">{d.minTemp}°</span>
              </div>
              <div className="mt-1 text-[11px] text-sky-600 font-medium">
                {d.popMax}% rain prob
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
