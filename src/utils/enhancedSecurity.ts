
import { sanitizeInput, validateEmail, validatePassword, RateLimiter } from './security';

// Enhanced rate limiting for different operations
export class EnhancedRateLimiter {
  private rateLimiters: Map<string, RateLimiter> = new Map();

  constructor() {
    // Different rate limits for different operations
    this.rateLimiters.set('login', new RateLimiter(5, 15 * 60 * 1000)); // 5 attempts per 15 minutes
    this.rateLimiters.set('registration', new RateLimiter(3, 60 * 60 * 1000)); // 3 attempts per hour
    this.rateLimiters.set('password_reset', new RateLimiter(3, 60 * 60 * 1000)); // 3 attempts per hour
    this.rateLimiters.set('otp_verification', new RateLimiter(5, 10 * 60 * 1000)); // 5 attempts per 10 minutes
    this.rateLimiters.set('file_upload', new RateLimiter(10, 60 * 60 * 1000)); // 10 uploads per hour
  }

  isAllowed(operation: string, identifier: string): boolean {
    const limiter = this.rateLimiters.get(operation);
    if (!limiter) return true;
    
    return limiter.isAllowed(`${operation}:${identifier}`);
  }

  getRemainingTime(operation: string, identifier: string): number {
    const limiter = this.rateLimiters.get(operation);
    if (!limiter) return 0;
    
    return limiter.getRemainingTime(`${operation}:${identifier}`);
  }
}

// Enhanced input validation with context awareness
export interface ValidationContext {
  userRole?: string;
  isAuthenticated?: boolean;
  previousAttempts?: number;
}

export const validateInputWithContext = (
  input: string,
  type: 'email' | 'password' | 'name' | 'phone' | 'text',
  context?: ValidationContext
): { isValid: boolean; errors: string[]; sanitized: string } => {
  const errors: string[] = [];
  const sanitized = sanitizeInput(input);

  // Length validation based on type
  const lengthRules = {
    email: { min: 5, max: 254 },
    password: { min: 8, max: 128 },
    name: { min: 2, max: 100 },
    phone: { min: 10, max: 20 },
    text: { min: 1, max: 5000 }
  };

  const rules = lengthRules[type];
  if (sanitized.length < rules.min) {
    errors.push(`${type} must be at least ${rules.min} characters long`);
  }
  if (sanitized.length > rules.max) {
    errors.push(`${type} must be no more than ${rules.max} characters long`);
  }

  // Type-specific validation
  switch (type) {
    case 'email':
      if (!validateEmail(sanitized)) {
        errors.push('Invalid email format');
      }
      break;
    case 'password':
      const passwordValidation = validatePassword(sanitized);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
      break;
    case 'name':
      if (!/^[a-zA-Z\s\-\.\']+$/.test(sanitized)) {
        errors.push('Name can only contain letters, spaces, hyphens, dots, and apostrophes');
      }
      break;
    case 'phone':
      if (!/^\+?[\d\s\-\(\)]+$/.test(sanitized)) {
        errors.push('Invalid phone number format');
      }
      break;
  }

  // Context-aware validation
  if (context?.previousAttempts && context.previousAttempts > 3) {
    // Add additional validation for users with multiple failed attempts
    if (type === 'password' && sanitized.length < 12) {
      errors.push('Due to previous failed attempts, password must be at least 12 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
};

// Session security utilities
export class SessionSecurity {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_CONCURRENT_SESSIONS = 3;
  
  static startSessionMonitoring() {
    // Monitor for session timeout
    let lastActivity = Date.now();
    
    const updateActivity = () => {
      lastActivity = Date.now();
    };

    // Listen for user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check for session timeout every minute
    const checkTimeout = setInterval(() => {
      if (Date.now() - lastActivity > this.SESSION_TIMEOUT) {
        this.handleSessionTimeout();
        clearInterval(checkTimeout);
      }
    }, 60000);

    return () => {
      clearInterval(checkTimeout);
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }

  private static async handleSessionTimeout() {
    console.log('Session timeout detected, logging out user');
    // Import supabase client dynamically to avoid circular imports
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.auth.signOut();
    
    // Redirect to login page
    window.location.href = '/auth';
  }

  static validateSessionIntegrity(): boolean {
    // Check for session tampering indicators
    const sessionData = localStorage.getItem('supabase.auth.token');
    if (!sessionData) return false;

    try {
      const parsed = JSON.parse(sessionData);
      // Add additional integrity checks here
      return true;
    } catch {
      return false;
    }
  }
}

// File upload security validation
export const validateFileUpload = (file: File): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // File size validation (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB');
  }

  // File type validation
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'text/plain'
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }

  // Check for executable files in disguise
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.jar'];
  const fileName = file.name.toLowerCase();
  
  if (dangerousExtensions.some(ext => fileName.includes(ext))) {
    errors.push('Potentially dangerous file detected');
  }

  // Check for multiple extensions
  const extensionCount = (fileName.match(/\./g) || []).length;
  if (extensionCount > 1) {
    errors.push('Files with multiple extensions are not allowed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Content Security Policy helper
export const applySecurityHeaders = () => {
  // This would typically be handled by the server, but we can add some client-side protections
  
  // Prevent clickjacking
  if (window.self !== window.top) {
    window.top!.location = window.self.location;
  }

  // Add security meta tags if not present
  const addMetaTag = (name: string, content: string) => {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  };

  addMetaTag('referrer', 'strict-origin-when-cross-origin');
  addMetaTag('robots', 'noindex, nofollow');
};

// Initialize security measures
export const initializeSecurity = () => {
  applySecurityHeaders();
  return SessionSecurity.startSessionMonitoring();
};
