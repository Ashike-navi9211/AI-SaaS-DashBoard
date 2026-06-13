import API from './axios';

export const getTodayUsage = () => API.get('/usage/today');
export const getWeeklyUsage = () => API.get('/usage/weekly');
export const getHistory = (page = 1) => API.get(`/usage/history?page=${page}`);
