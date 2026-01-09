export const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

// For combined deployment (same domain), use relative URLs
// For separate deployment, set VITE_API_URL to the API domain
// Default to localhost for development
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If explicitly set to empty string, use relative URLs (same domain)
  if (envUrl === '') {
    return '';
  }
  
  // If set to a specific URL, use it
  if (envUrl) {
    return envUrl;
  }
  
  // Default to localhost for development
  return 'http://localhost:4000';
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

