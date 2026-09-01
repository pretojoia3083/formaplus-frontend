export const CACHE_KEYS = {
  DASHBOARD: 'dashboard_data',
  WORKOUTS: 'workouts_data',
  NUTRITION: 'nutrition_data',
  PROGRESS: 'progress_data',
}

export const REVALIDATION = {
  DASHBOARD: 60 * 1000,
  WORKOUTS: 5 * 60 * 1000,
  NUTRITION: 5 * 60 * 1000,
  PROGRESS: 60 * 1000,
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/json',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  WORKOUTS: {
    GENERATE: '/workouts/generate',
    ACTIVE: '/workouts/active',
    TODAY: '/workouts/today',
    HISTORY: '/workouts/history',
    START: '/workouts/sessions/:id/start',
    FINISH: '/workouts/sessions/:id/finish',
    LOG_EXERCISE: '/workouts/exercises/:id/log',
    ADAPT: '/workouts/sessions/:id/adapt',
    SUBSTITUTE: '/workouts/exercises/:id/substitute',
  },
  NUTRITION: {
    GENERATE: '/nutrition/generate',
    ACTIVE: '/nutrition/active',
    TODAY: '/nutrition/today',
    LOG: '/nutrition/log',
    ESTIMATE: '/nutrition/estimate-meal',
    DAILY_PROGRESS: '/nutrition/daily-progress',
    HISTORY: '/nutrition/history',
  },
  PROGRESS: {
    DASHBOARD: '/dashboard',
    SUMMARY: '/progress/summary',
    WEIGHT: '/progress/weight',
    MEASUREMENTS: '/progress/measurements',
    WATER: '/progress/water',
    STEPS: '/progress/steps',
    STREAK: '/progress/streak',
  },
  COACH: {
    MESSAGE: '/coach/message',
    CONVERSATIONS: '/coach/conversations',
    CONVERSATION: '/coach/conversations/:id',
  },
  SUBSCRIPTIONS: {
    PLANS: '/plans',
    PLAN: '/plans/:type',
    SUBSCRIPTION: '/subscription',
    CREATE: '/subscription/create',
    CANCEL: '/subscription/cancel',
    UPDATE: '/subscription/update',
    PAYMENTS: '/payments',
  },
}
