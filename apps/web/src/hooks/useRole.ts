import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isFarmer = user?.role === 'farmer';
  const isRoaster = user?.role === 'roaster';
  const isTrader = user?.role === 'trader';

  const hasRole = (role: string) => user?.role === role;
  const hasAnyRole = (roles: string[]) => roles.includes(user?.role);

  return {
    isAdmin,
    isFarmer,
    isRoaster,
    isTrader,
    hasRole,
    hasAnyRole,
    currentRole: user?.role
  };
};

