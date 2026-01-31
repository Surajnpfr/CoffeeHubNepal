export const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

// API URL Configuration:
// - In production (Heroku), frontend and backend are on same domain - use relative URLs
// - In development, use localhost:4000
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is set, use it
  if (envUrl !== undefined) {
    return envUrl;
  }
  
  // Production: use /api so client routes (/jobs, /about, etc.) are served index.html on refresh
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // Default to localhost for development (API is mounted at /api)
  return 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const APP_COLORS = {
  coffee: {
    brown: '#6F4E37',
    dark: '#4E3626',
    light: '#EBE3D5',
    cream: '#F5EFE6',
    bg: '#F8F5F2',
  },
  green: {
    primary: '#3A7D44',
  },
} as const;

export const USER_ROLES = {
  FARMER: 'farmer',
  ROASTER: 'roaster',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

