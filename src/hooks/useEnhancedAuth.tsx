
import { useCallback } from 'react';
import { useSecureAuth } from './useSecureAuth';
import { useSecurityAudit } from './useSecurityAudit';
import { EnhancedRateLimiter, validateInputWithContext } from '@/utils/enhancedSecurity';

const rateLimiter = new EnhancedRateLimiter();

export const useEnhancedAuth = () => {
  const { signIn, signUp, user, loading } = useSecureAuth();
  const { logFailedLogin, logSuccessfulLogin, logSuspiciousActivity } = useSecurityAudit();

  const enhancedSignIn = useCallback(async (email: string, password: string) => {
    // Rate limiting check
    if (!rateLimiter.isAllowed('login', email)) {
      const remainingTime = rateLimiter.getRemainingTime('login', email);
      logSuspiciousActivity('rate_limit_exceeded', { 
        operation: 'login', 
        email, 
        remainingTime 
      });
      return {
        success: false,
        error: `Too many login attempts. Please wait ${Math.ceil(remainingTime / 60000)} minutes before trying again.`
      };
    }

    // Enhanced input validation
    const emailValidation = validateInputWithContext(email, 'email');
    const passwordValidation = validateInputWithContext(password, 'password');

    if (!emailValidation.isValid) {
      logFailedLogin(email, 'Invalid email format');
      return {
        success: false,
        error: emailValidation.errors.join(', ')
      };
    }

    if (!passwordValidation.isValid) {
      logFailedLogin(email, 'Invalid password format');
      return {
        success: false,
        error: 'Invalid password format'
      };
    }

    try {
      const result = await signIn(emailValidation.sanitized, password);
      
      if (result.success && result.user) {
        logSuccessfulLogin(result.user.id);
      } else {
        logFailedLogin(email, result.error || 'Authentication failed');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logFailedLogin(email, errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [signIn, logFailedLogin, logSuccessfulLogin, logSuspiciousActivity]);

  const enhancedSignUp = useCallback(async (email: string, password: string, userData: Record<string, any>) => {
    // Rate limiting check
    if (!rateLimiter.isAllowed('registration', email)) {
      const remainingTime = rateLimiter.getRemainingTime('registration', email);
      logSuspiciousActivity('rate_limit_exceeded', { 
        operation: 'registration', 
        email, 
        remainingTime 
      });
      return {
        success: false,
        error: `Too many registration attempts. Please wait ${Math.ceil(remainingTime / 60000)} minutes before trying again.`
      };
    }

    // Enhanced input validation
    const emailValidation = validateInputWithContext(email, 'email');
    const passwordValidation = validateInputWithContext(password, 'password');
    const nameValidation = validateInputWithContext(userData.fullName || '', 'name');

    const errors: string[] = [];
    if (!emailValidation.isValid) errors.push(...emailValidation.errors);
    if (!passwordValidation.isValid) errors.push(...passwordValidation.errors);
    if (!nameValidation.isValid) errors.push(...nameValidation.errors);

    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join(', ')
      };
    }

    try {
      const result = await signUp(emailValidation.sanitized, password, {
        ...userData,
        fullName: nameValidation.sanitized
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [signUp, logSuspiciousActivity]);

  return {
    enhancedSignIn,
    enhancedSignUp,
    user,
    loading,
    // Expose rate limiter status for UI feedback
    isRateLimited: (operation: string, identifier: string) => !rateLimiter.isAllowed(operation, identifier),
    getRemainingTime: (operation: string, identifier: string) => rateLimiter.getRemainingTime(operation, identifier)
  };
};
