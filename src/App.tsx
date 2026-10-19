import React, { useState, useEffect } from 'react';
import {
  NavigationPage,
  Task,
  PowerBIProject,
  AILearningRecord,
  JobRecord,
  OutreachContact,
  SocialMediaPost,
  HouseholdTask,
  WeeklyGoal,
  SleepLog,
  WeatherData,
} from './types';
import { StorageService, UserSettings } from './utils/storage';
import { fetchLahoreWeather } from './utils/weather';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { TodayDashboard } from './components/TodayDashboard';
import { MyPlanner } from './components/MyPlanner';
import { PowerBIProjects } from './components/PowerBIProjects';
import { AILearningTracker } from './components/AILearningTracker';
import { JobSearchTracker } from './components/JobSearchTracker';
import { OutreachWorkspace } from './components/OutreachWorkspace';
import { SocialMediaPlanner } from './components/SocialMediaPlanner';
import { HomeManagement } from './components/HomeManagement';
import { WeatherWidget } from './components/WeatherWidget';
import { WeeklyProgress } from './components/WeeklyProgress';
import { SettingsView } from './components/SettingsView';
import { PlanMyDayModal } from './components/PlanMyDayModal';
import { getKarachiCurrentTime } from './utils/karachiTime';
import { Bell, X } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavigationPage>(() => {
    return (StorageService.getLastPage('today') as NavigationPage) || 'today';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlanMyDayOpen, setIsPlanMyDayOpen] = useState(false);

  // App Data State
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());
  const [projects, setProjects] = useState<PowerBIProject[]>(() => StorageService.getProjects());
  const [learningRecords, setLearningRecords] = useState<AILearningRecord[]>(() =>
    StorageService.getLearningRecords()
  );
  const [jobs, setJobs] = useState<JobRecord[]>(() => StorageService.getJobs());
  const [outreach, setOutreach] = useState<OutreachContact[]>(() => StorageService.getOutreach());
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>(() =>
    StorageService.getSocialPosts()
  );
  const [householdTasks, setHouseholdTasks] = useState<HouseholdTask[]>(() =>
    StorageService.getHouseholdTasks()
  );
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal>(() => StorageService.getWeeklyGoal());
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => StorageService.getSleepLogs());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());

  // Weather State
  const [weather, setWeather] = useState<WeatherData>({
    city: 'Lahore, Pakistan',
    temperature: 28,
    apparentTemperature: 29,
    weatherCode: 1,
    weatherDescription: 'Mainly Clear',
    humidity: 50,
    precipitation: 0,
    windSpeed: 10,
    lastUpdated: 'Loading...',
    hourly: [],
    daily: [],
    isLoading: true,
  });

  // Active in-app reminder
  const [activeReminder, setActiveReminder] = useState<string | null>(null);

  // Load weather on mount
  useEffect(() => {
    refreshWeather();
  }, [settings.latitude, settings.longitude]);

  const refreshWeather = async () => {
    setWeather((prev) => ({ ...prev, isLoading: true }));
    const data = await fetchLahoreWeather(settings.latitude, settings.longitude);
    setWeather(data);
  };

  // Synchronize navigation page to localStorage
  const handleNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    StorageService.setLastPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // In-app scheduled reminders check
  useEffect(() => {
    const checkReminders = () => {
      const time = getKarachiCurrentTime();
      const currentH = time.hour;
      const currentM = time.minute;

      if (currentH === 14 && currentM >= 45 && currentM <= 55) {
        setActiveReminder('Tuition Academy Reminder: Prep worksheets and tuition room for the 3:00 PM batch.');
      } else if (currentH === 21 && currentM >= 30 && currentM <= 45) {
        setActiveReminder('Live AI Class Setup: Test audio & IDE setup before class starts at 10:00 PM.');
      } else if (currentH === 9 && currentM >= 55) {
        setActiveReminder('Deep Work Focus: 10:00 AM Power BI project session starting shortly.');
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  // Task actions
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          status: (nextCompleted ? 'Completed' : 'Pending') as any,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    setTasks(updated);
    StorageService.setTasks(updated);
  };

  const handleAddTask = (newTask: Task) => {
    const updated = [...tasks, newTask];
    setTasks(updated);
    StorageService.setTasks(updated);
  };

  const handleEditTask = (updatedTask: Task) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updated);
    StorageService.setTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    StorageService.setTasks(updated);
  };

  const handleMoveToTomorrow = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'Postponed' as any,
          notes: `${t.notes || ''} [Moved to tomorrow]`.trim(),
        };
      }
      return t;
    });
    setTasks(updated);
    StorageService.setTasks(updated);
  };

  const handleApplyPlanChanges = (newTasks: Task[]) => {
    setTasks(newTasks);
    StorageService.setTasks(newTasks);
  };

  // One-click optimize sleep schedule
  const handleApplyBalancedSleepSchedule = () => {
    const updated = tasks.map((t) => {
      if (t.id === 'task-17') {
        // Shift social media from 1:30 AM to daytime (12:00 PM)
        return {
          ...t,
          startTime: '12:00',
          endTime: '12:30',
          notes: 'Shifted to daytime to protect night sleep',
        };
      }
      if (t.id === 'task-18') {
        // Sleep extended to 7.0 hours (01:00 AM to 08:00 AM)
        return {
          ...t,
          startTime: '01:00',
          endTime: '08:00',
          estimatedDuration: 420,
          title: 'Sleep & Night Recovery (Optimized: 7.0 hours)',
          notes: 'Healthy 7-hour sleep window achieved.',
        };
      }
      return t;
    });
    setTasks(updated);
    StorageService.setTasks(updated);
  };

  // Reload data from storage after import/reset
  const handleReloadAllData = () => {
    setTasks(StorageService.getTasks());
    setProjects(StorageService.getProjects());
    setLearningRecords(StorageService.getLearningRecords());
    setJobs(StorageService.getJobs());
    setOutreach(StorageService.getOutreach());
    setSocialPosts(StorageService.getSocialPosts());
    setHouseholdTasks(StorageService.getHouseholdTasks());
    setWeeklyGoal(StorageService.getWeeklyGoal());
    setSleepLogs(StorageService.getSleepLogs());
    setSettings(StorageService.getSettings());
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        completionRate={completionRate}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenPlanMyDay={() => setIsPlanMyDayOpen(true)}
          onNavigateWeather={() => handleNavigate('weather')}
          weather={weather}
          completedTasks={completedCount}
          totalTasks={tasks.length}
        />

        {/* In-app reminder alert if triggered */}
        {activeReminder && (
          <div className="bg-purple-900 px-4 py-2 text-xs text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-300" />
              <span className="font-semibold">{activeReminder}</span>
            </div>
            <button
              onClick={() => setActiveReminder(null)}
              className="text-purple-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'today' && (
            <TodayDashboard
              tasks={tasks}
              weather={weather}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveToTomorrow={handleMoveToTomorrow}
              onOpenPlanMyDay={() => setIsPlanMyDayOpen(true)}
              onNavigateWeather={() => handleNavigate('weather')}
              onNavigatePlanner={() => handleNavigate('planner')}
            />
          )}

          {currentPage === 'planner' && (
            <MyPlanner
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveToTomorrow={handleMoveToTomorrow}
              onApplyBalancedSleepSchedule={handleApplyBalancedSleepSchedule}
            />
          )}

          {currentPage === 'powerbi' && (
            <PowerBIProjects
              projects={projects}
              onUpdateProjects={(updated) => {
                setProjects(updated);
                StorageService.setProjects(updated);
              }}
            />
          )}

          {currentPage === 'learning' && (
            <AILearningTracker
              records={learningRecords}
              onUpdateRecords={(updated) => {
                setLearningRecords(updated);
                StorageService.setLearningRecords(updated);
              }}
            />
          )}

          {currentPage === 'home' && (
            <HomeManagement
              householdTasks={householdTasks}
              onUpdateTasks={(updated) => {
                setHouseholdTasks(updated);
                StorageService.setHouseholdTasks(updated);
              }}
              weather={weather}
            />
          )}

          {currentPage === 'jobs' && (
            <JobSearchTracker
              jobs={jobs}
              onUpdateJobs={(updated) => {
                setJobs(updated);
                StorageService.setJobs(updated);
              }}
              onNavigateOutreach={() => handleNavigate('social')}
            />
          )}

          {currentPage === 'social' && (
            <div className="space-y-8">
              <SocialMediaPlanner
                posts={socialPosts}
                onUpdatePosts={(updated) => {
                  setSocialPosts(updated);
                  StorageService.setSocialPosts(updated);
                }}
              />
              <div className="pt-6 border-t border-slate-200">
                <OutreachWorkspace
                  contacts={outreach}
                  onUpdateContacts={(updated) => {
                    setOutreach(updated);
                    StorageService.setOutreach(updated);
                  }}
                />
              </div>
            </div>
          )}

          {currentPage === 'weather' && (
            <WeatherWidget weather={weather} onRefreshWeather={refreshWeather} />
          )}

          {currentPage === 'progress' && (
            <WeeklyProgress
              weeklyGoal={weeklyGoal}
              onUpdateGoal={(updated) => {
                setWeeklyGoal(updated);
                StorageService.setWeeklyGoal(updated);
              }}
              sleepLogs={sleepLogs}
              tasks={tasks}
              projects={projects}
              learningRecords={learningRecords}
              jobs={jobs}
              outreach={outreach}
              socialPosts={socialPosts}
              householdTasks={householdTasks}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(updated) => setSettings(updated)}
              onReloadAllData={handleReloadAllData}
            />
          )}
        </main>
      </div>

      {/* Plan My Day AI Modal */}
      <PlanMyDayModal
        isOpen={isPlanMyDayOpen}
        onClose={() => setIsPlanMyDayOpen(false)}
        tasks={tasks}
        weather={weather}
        onApplyPlanChanges={handleApplyPlanChanges}
      />
    </div>
  );
}
