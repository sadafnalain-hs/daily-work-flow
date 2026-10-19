import {
  Task,
  PowerBIProject,
  AILearningRecord,
  JobRecord,
  OutreachContact,
  SocialMediaPost,
  HouseholdTask,
  WeeklyGoal,
  SleepLog,
} from '../types';
import {
  DEFAULT_TASKS,
  DEFAULT_PROJECTS,
  DEFAULT_AI_LEARNING,
  DEFAULT_JOBS,
  DEFAULT_OUTREACH,
  DEFAULT_SOCIAL_POSTS,
  DEFAULT_HOUSEHOLD,
  DEFAULT_WEEKLY_GOAL,
  DEFAULT_SLEEP_LOGS,
} from './defaults';

const KEYS = {
  TASKS: 'lifeflow_tasks',
  PROJECTS: 'lifeflow_projects',
  LEARNING: 'lifeflow_learning',
  JOBS: 'lifeflow_jobs',
  OUTREACH: 'lifeflow_outreach',
  SOCIAL: 'lifeflow_social',
  HOUSEHOLD: 'lifeflow_household',
  WEEKLY_GOAL: 'lifeflow_weekly_goal',
  SLEEP_LOGS: 'lifeflow_sleep_logs',
  USER_SETTINGS: 'lifeflow_settings',
  LAST_PAGE: 'lifeflow_last_page',
};

export interface UserSettings {
  userName: string;
  userRole: string;
  city: string;
  latitude: number;
  longitude: number;
  sleepTargetHours: number;
  socialDailyTargetMinutes: number;
  tuitionStartTime: string;
  tuitionEndTime: string;
  aiClassStartTime: string;
  aiClassEndTime: string;
  soundNotifications: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Sadaf',
  userRole: 'Junior Data Analyst',
  city: 'Lahore, Pakistan',
  latitude: 31.58,
  longitude: 74.33,
  sleepTargetHours: 7.5,
  socialDailyTargetMinutes: 90,
  tuitionStartTime: '15:00',
  tuitionEndTime: '18:00',
  aiClassStartTime: '22:00',
  aiClassEndTime: '00:00',
  soundNotifications: true,
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  getTasks: (): Task[] => getFromStorage<Task[]>(KEYS.TASKS, DEFAULT_TASKS),
  setTasks: (tasks: Task[]): void => setToStorage(KEYS.TASKS, tasks),

  getProjects: (): PowerBIProject[] => getFromStorage<PowerBIProject[]>(KEYS.PROJECTS, DEFAULT_PROJECTS),
  setProjects: (projects: PowerBIProject[]): void => setToStorage(KEYS.PROJECTS, projects),

  getLearningRecords: (): AILearningRecord[] => getFromStorage<AILearningRecord[]>(KEYS.LEARNING, DEFAULT_AI_LEARNING),
  setLearningRecords: (records: AILearningRecord[]): void => setToStorage(KEYS.LEARNING, records),

  getJobs: (): JobRecord[] => getFromStorage<JobRecord[]>(KEYS.JOBS, DEFAULT_JOBS),
  setJobs: (jobs: JobRecord[]): void => setToStorage(KEYS.JOBS, jobs),

  getOutreach: (): OutreachContact[] => getFromStorage<OutreachContact[]>(KEYS.OUTREACH, DEFAULT_OUTREACH),
  setOutreach: (outreach: OutreachContact[]): void => setToStorage(KEYS.OUTREACH, outreach),

  getSocialPosts: (): SocialMediaPost[] => getFromStorage<SocialMediaPost[]>(KEYS.SOCIAL, DEFAULT_SOCIAL_POSTS),
  setSocialPosts: (posts: SocialMediaPost[]): void => setToStorage(KEYS.SOCIAL, posts),

  getHouseholdTasks: (): HouseholdTask[] => getFromStorage<HouseholdTask[]>(KEYS.HOUSEHOLD, DEFAULT_HOUSEHOLD),
  setHouseholdTasks: (tasks: HouseholdTask[]): void => setToStorage(KEYS.HOUSEHOLD, tasks),

  getWeeklyGoal: (): WeeklyGoal => getFromStorage<WeeklyGoal>(KEYS.WEEKLY_GOAL, DEFAULT_WEEKLY_GOAL),
  setWeeklyGoal: (goal: WeeklyGoal): void => setToStorage(KEYS.WEEKLY_GOAL, goal),

  getSleepLogs: (): SleepLog[] => getFromStorage<SleepLog[]>(KEYS.SLEEP_LOGS, DEFAULT_SLEEP_LOGS),
  setSleepLogs: (logs: SleepLog[]): void => setToStorage(KEYS.SLEEP_LOGS, logs),

  getSettings: (): UserSettings => getFromStorage<UserSettings>(KEYS.USER_SETTINGS, DEFAULT_SETTINGS),
  setSettings: (settings: UserSettings): void => setToStorage(KEYS.USER_SETTINGS, settings),

  getLastPage: (defaultPage: string): string => getFromStorage<string>(KEYS.LAST_PAGE, defaultPage),
  setLastPage: (page: string): void => setToStorage(KEYS.LAST_PAGE, page),

  exportAllData: (): string => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: StorageService.getTasks(),
      projects: StorageService.getProjects(),
      learning: StorageService.getLearningRecords(),
      jobs: StorageService.getJobs(),
      outreach: StorageService.getOutreach(),
      social: StorageService.getSocialPosts(),
      household: StorageService.getHouseholdTasks(),
      weeklyGoal: StorageService.getWeeklyGoal(),
      sleepLogs: StorageService.getSleepLogs(),
      settings: StorageService.getSettings(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData: (jsonStr: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tasks) StorageService.setTasks(data.tasks);
      if (data.projects) StorageService.setProjects(data.projects);
      if (data.learning) StorageService.setLearningRecords(data.learning);
      if (data.jobs) StorageService.setJobs(data.jobs);
      if (data.outreach) StorageService.setOutreach(data.outreach);
      if (data.social) StorageService.setSocialPosts(data.social);
      if (data.household) StorageService.setHouseholdTasks(data.household);
      if (data.weeklyGoal) StorageService.setWeeklyGoal(data.weeklyGoal);
      if (data.sleepLogs) StorageService.setSleepLogs(data.sleepLogs);
      if (data.settings) StorageService.setSettings(data.settings);
      return { success: true, message: 'All personal data successfully imported!' };
    } catch (err) {
      return { success: false, message: 'Failed to import backup file. Ensure it is valid JSON.' };
    }
  },

  resetToDefault: (): void => {
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.PROJECTS);
    localStorage.removeItem(KEYS.LEARNING);
    localStorage.removeItem(KEYS.JOBS);
    localStorage.removeItem(KEYS.OUTREACH);
    localStorage.removeItem(KEYS.SOCIAL);
    localStorage.removeItem(KEYS.HOUSEHOLD);
    localStorage.removeItem(KEYS.WEEKLY_GOAL);
    localStorage.removeItem(KEYS.SLEEP_LOGS);
    localStorage.removeItem(KEYS.USER_SETTINGS);
  },

  clearAllData: (): void => {
    localStorage.clear();
  },
};
