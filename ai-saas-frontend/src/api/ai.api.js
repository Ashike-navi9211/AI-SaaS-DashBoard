import API from './axios';

export const callAI = (data) => API.post('/ai/generate', data);
