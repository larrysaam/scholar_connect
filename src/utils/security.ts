
import DOMPurify from 'dompurify';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters and scripts
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // Additional XSS prevention
  return sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Email validation with security checks
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitizedEmail = sanitizeInput(email);
  
  return emailRegex.test(sanitizedEmail) && 
         sanitizedEmail.length <= 254 && 
         !sanitizedEmail.includes('..') &&
         !sanitizedEmail.startsWith('.') &&
         !sanitizedEmail.endsWith('.');
};

// Password strength validation
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  const weakPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common and easily guessable');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// File upload validation
export const validateFile = (file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): {
  isValid: boolean;
  error?: string;
} => {
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    };
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  // Check for double extensions (potential security risk)
  const extensionCount = (file.name.match(/\./g) || []).length;
  if (extensionCount > 1) {
    return {
      isValid: false,
      error: 'Files with multiple extensions are not allowed'
    };
  }
  
  // Check MIME type matches extension
  const expectedMimeTypes: { [key: string]: string[] } = {
    'pdf': ['application/pdf'],
    'doc': ['application/msword'],
    'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'jpg': ['image/jpeg'],
    'jpeg': ['image/jpeg'],
    'png': ['image/png']
  };
  
  if (expectedMimeTypes[fileExtension] && !expectedMimeTypes[fileExtension].includes(file.type)) {
    return {
      isValid: false,
      error: 'File type does not match file extension'
    };
  }
  
  return { isValid: true };
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 15 * 60 * 1000) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    
    return Math.max(0, record.resetTime - Date.now());
  }
}

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken && token.length === 64;
};

// Content Security Policy helper
export const getCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://aigusgidjcfkhcmsghmn.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
};
