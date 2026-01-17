import { useAuth } from '@/context/AuthContext';

/**
 * Hook to check user verification status
 * Returns verification state and helper functions
 */
export const useVerification = () => {
  const { user, isAuthenticated } = useAuth();

  const isVerified = user?.verified === true;
  const isVisitor = Boolean(isAuthenticated && user && !user.verified);

  const verificationMessage = isVisitor
    ? 'Account verification required. Please wait for admin approval to post or interact.'
    : '';

  return {
    isVerified,
    isVisitor,
    verificationMessage,
  };
};
