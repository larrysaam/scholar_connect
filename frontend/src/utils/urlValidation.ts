/**
 * URL validation utilities for research profile fields
 */

export interface URLValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a general URL format
 */
export const isValidURL = (url: string): boolean => {
  if (!url || url.trim() === '') return true; // Empty URLs are allowed (optional fields)
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates ORCID ID format (16 digits with dashes: 0000-0000-0000-0000)
 */
export const validateORCIDID = (orcidId: string): URLValidationResult => {
  if (!orcidId || orcidId.trim() === '') {
    return { isValid: true }; // Optional field
  }

  // Remove any existing dashes and spaces
  const cleanedId = orcidId.replace(/[-\s]/g, '');
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleanedId)) {
    return { 
      isValid: false, 
      error: 'ORCID ID should contain only digits' 
    };
  }

  // Check if it has exactly 16 digits
  if (cleanedId.length !== 16) {
    return { 
      isValid: false, 
      error: 'ORCID ID must be exactly 16 digits long' 
    };
  }

  return { isValid: true };
};

/**
 * Formats ORCID ID with proper dashes (0000-0000-0000-0000)
 */
export const formatORCIDID = (orcidId: string): string => {
  if (!orcidId) return '';
  
  // Remove any existing dashes and spaces
  const cleanedId = orcidId.replace(/[-\s]/g, '');
  
  // Only format if it contains only digits
  if (!/^\d+$/.test(cleanedId)) {
    return orcidId; // Return original if it contains non-digits
  }
  
  // Add dashes every 4 digits, but only if we have enough digits
  if (cleanedId.length >= 4) {
    return cleanedId.replace(/(\d{4})/g, '$1-').replace(/-$/, '');
  }
  
  return cleanedId;
};

/**
 * Validates LinkedIn URL format
 */
export const validateLinkedInURL = (url: string): URLValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: true }; // Optional field
  }

  if (!isValidURL(url)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid URL starting with http:// or https://' 
    };
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if it's a LinkedIn domain
    if (!hostname.includes('linkedin.com')) {
      return { 
        isValid: false, 
        error: 'Please enter a valid LinkedIn profile URL (linkedin.com)' 
      };
    }

    // Check if it follows LinkedIn profile pattern
    const pathname = urlObj.pathname.toLowerCase();
    if (!pathname.includes('/in/') && !pathname.includes('/pub/')) {
      return { 
        isValid: false, 
        error: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)' 
      };
    }

    return { isValid: true };
  } catch {
    return { 
      isValid: false, 
      error: 'Please enter a valid LinkedIn URL' 
    };
  }
};

/**
 * Validates ResearchGate URL format
 */
export const validateResearchGateURL = (url: string): URLValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: true }; // Optional field
  }

  if (!isValidURL(url)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid URL starting with http:// or https://' 
    };
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if it's a ResearchGate domain
    if (!hostname.includes('researchgate.net')) {
      return { 
        isValid: false, 
        error: 'Please enter a valid ResearchGate profile URL (researchgate.net)' 
      };
    }

    // Check if it follows ResearchGate profile pattern
    const pathname = urlObj.pathname.toLowerCase();
    if (!pathname.includes('/profile/')) {
      return { 
        isValid: false, 
        error: 'Please enter a valid ResearchGate profile URL (e.g., https://researchgate.net/profile/yourprofile)' 
      };
    }

    return { isValid: true };
  } catch {
    return { 
      isValid: false, 
      error: 'Please enter a valid ResearchGate URL' 
    };
  }
};

/**
 * Validates Academia.edu URL format
 */
export const validateAcademiaEduURL = (url: string): URLValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: true }; // Optional field
  }

  if (!isValidURL(url)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid URL starting with http:// or https://' 
    };
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if it's an Academia.edu domain
    if (!hostname.includes('academia.edu')) {
      return { 
        isValid: false, 
        error: 'Please enter a valid Academia.edu profile URL (academia.edu)' 
      };
    }

    // Academia.edu URLs can be in various formats:
    // https://university.academia.edu/FirstnameLastname
    // https://academia.edu/people/FirstnameLastname
    // We'll be flexible and just check for academia.edu domain

    return { isValid: true };
  } catch {
    return { 
      isValid: false, 
      error: 'Please enter a valid Academia.edu URL' 
    };
  }
};

/**
 * Validates research profile URLs based on the field type
 */
export const validateResearchProfileURL = (
  fieldName: string, 
  url: string
): URLValidationResult => {
  switch (fieldName.toLowerCase()) {
    case 'linkedinaccount':
    case 'linkedin':
    case 'linkedin_account':
      return validateLinkedInURL(url);
    
    case 'researchgateaccount':
    case 'researchgate':
    case 'researchgate_account':
      return validateResearchGateURL(url);
    
    case 'academiaeduaccount':
    case 'academia':
    case 'academia_edu_account':
      return validateAcademiaEduURL(url);
    
    case 'orcidid':
    case 'orcid':
    case 'orcid_id':
      return validateORCIDID(url);

    default:
      // For any other URL field, just validate it's a proper URL
      if (!url || url.trim() === '') {
        return { isValid: true };
      }
      
      return isValidURL(url) 
        ? { isValid: true }
        : { isValid: false, error: 'Please enter a valid URL starting with http:// or https://' };
  }
};
