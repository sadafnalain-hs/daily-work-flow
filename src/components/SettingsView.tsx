import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  User,
  Moon,
  Clock,
} from 'lucide-react';
import { UserSettings, StorageService } from '../utils/storage';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onReloadAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onReloadAllData,
}) => {
  const [userName, setUserName] = useState(settings.userName);
  const [userRole, setUserRole] = useState(settings.userRole);
  const [sleepTarget, setSleepTarget] = useState(settings.sleepTargetHours);
  const [socialTarget, setSocialTarget] = useState(settings.socialDailyTargetMinutes);
  const [tuitionStart, setTuitionStart] = useState(settings.tuitionStartTime);
  const [tuitionEnd, setTuitionEnd] = useState(settings.tuitionEndTime);
  const [aiClassStart, setAiClassStart] = useState(settings.aiClassStartTime);
  const [aiClassEnd, setAiClassEnd] = useState(settings.aiClassEndTime);

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [savedAlert, setSavedAlert] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSettings = {
      ...settings,
      userName: userName.trim(),
      userRole: userRole.trim(),
      sleepTargetHours: sleepTarget,
      socialDailyTargetMinutes: socialTarget,
      tuitionStartTime: tuitionStart,
      tuitionEndTime: tuitionEnd,
      aiClassStartTime: aiClassStart,
      aiClassEndTime: aiClassEnd,
    };
    StorageService.setSettings(updated);
    onUpdateSettings(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleExportData = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sadaf_LifeFlow_AI_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importAllData(content);
      if (res.success) {
        setImportStatus(res.message);
        onReloadAllData();
      } else {
        setImportStatus(res.message);
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
  };

  const handleRequestNotification = async () => {
    if (typeof Notification === 'undefined') {
      alert('Browser notifications are not supported in this environment. In-app reminders will remain active.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  const handleResetToDefault = () => {
    StorageService.resetToDefault();
    onReloadAllData();
    setIsResetConfirmOpen(false);
  };

  const handleClearAll = () => {
    StorageService.clearAllData();
    onReloadAllData();
    setIsClearConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Application Settings & Data Privacy</h2>
        <p className="text-xs text-slate-500">
          Manage your schedule protection rules, sleep target, and local data persistence
        </p>
      </div>

      {/* Profile & Schedule Protection Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-purple-700" />
          <span>Profile & Daily Commitments</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Role / Objective</label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sleep Goal Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="6"
                max="10"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(parseFloat(e.target.value) || 7.5)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-purple-600 focus:outline-hidden tabular-nums"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Recommended 7–9 hours for adult cognitive performance
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily Social Media Content Target (Minutes)
              </label>
              <input
                type="number"
                step="15"
                min="30"
                max="180"
                value={socialTarget}
                onChange={(e) => setSocialTarget(parseInt(e.target.value, 10) || 90)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-purple-600 focus:outline-hidden tabular-nums"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Default: 90 minutes dedicated to portfolio showcasing
              </span>
            </div>
          </div>

          {/* Protected Fixed Commitments Time Configuration */}
          <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 space-y-3">
            <div className="text-xs font-bold text-purple-900">
              Protected Fixed Commitment Windows (Non-negotiable)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tuition Academy (Afternoon Block)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={tuitionStart}
                    onChange={(e) => setTuitionStart(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={tuitionEnd}
                    onChange={(e) => setTuitionEnd(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Live AI Automation Class (Night Block)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={aiClassStart}
                    onChange={(e) => setAiClassStart(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={aiClassEnd}
                    onChange={(e) => setAiClassEnd(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {savedAlert && (
              <span className="text-xs font-semibold text-emerald-700">Settings saved!</span>
            )}
            <button
              type="submit"
              className="rounded-xl bg-purple-700 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-800 transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Notifications & Reminders */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Bell className="h-4 w-4 text-purple-700" />
          <span>Reminders & Notifications</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          In-app reminders fire automatically during active sessions for tuition preparation (2:45 PM),
          Power BI focus, and live AI class setup (9:30 PM).
        </p>

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div>
            <div className="text-xs font-semibold text-slate-900">Desktop Browser Notifications</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Status: <span className="font-semibold text-purple-800">{notificationPermission}</span>
            </div>
          </div>
          <button
            onClick={handleRequestNotification}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
          </button>
        </div>
      </div>

      {/* Data Storage, Backup & Privacy */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Local Data Storage & Privacy</span>
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            All your daily schedule records, Power BI work logs, jobs, outreach drafts, and notes are
            stored 100% locally on your browser via localStorage. Nothing is shared with third parties.
            You can export your complete backup at any time.
          </p>
        </div>

        {importStatus && (
          <div className="rounded-xl bg-purple-50 p-3 text-xs font-semibold text-purple-900 border border-purple-200">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-purple-700" />
            <span>Export All Data (JSON Backup)</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer">
            <Upload className="h-4 w-4 text-purple-700" />
            <span>Import Data from Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Danger zone: Reset & Clear */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Default Pakistani Schedule</span>
          </button>

          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All Local Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsResetConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Reset to Default Routine?</h4>
            <p className="mt-2 text-xs text-slate-600">
              This will restore the 17 default daily tasks (including tuition and AI classes) and starter Power BI projects.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefault}
                className="rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Reset Routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsClearConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-rose-600">Clear All Local Data?</h4>
            <p className="mt-2 text-xs text-slate-600">
              Are you sure? This will erase all tasks, projects, outreach drafts, and progress records from this device.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
