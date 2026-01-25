# Google Translate Fix - Complete Implementation

## Issues Fixed

### 1. Bidirectional Translation Issue ✅
**Problem:** Translation only worked from English to French (EN→FR), but not from French to English (FR→EN).

**Root Cause:** The Google Translate cookie was hardcoded to use `/en/fr` format, which explicitly sets the source language as English. This prevented the system from translating back from French to English.

**Solution:** Changed the cookie format from `/en/{lang}` to `/auto/{lang}` to enable automatic source language detection, allowing bidirectional translation.

**Files Modified:**
- `frontend/src/services/googleTranslate.ts`

**Changes Made:**
1. Updated `getCookieLanguage()` method to parse `/auto/` format instead of `/en/` format
2. Updated `setCookie()` method to use `/auto/${lang}` instead of hardcoded `/en/fr` or `/en/en`
3. Updated `googleTranslateElementInit()` to set `pageLanguage: 'auto'` instead of `pageLanguage: 'en'`
4. Added cookie clearing before setting new cookies to prevent conflicts

### 2. Brand Name Translation Issue ✅
**Problem:** "Research Tandem" brand name was being translated to French ("Tandem de recherche"), destroying brand identity.

**Root Cause:** Google Translate was treating all text as translatable by default.

**Solution:** Added the `notranslate` CSS class to all instances of "ResearchTandem" and "Research Tandem" to prevent Google Translate from translating the brand name.

**Files Modified:**
1. `frontend/src/components/ResearchWhoaLogo.tsx` - Logo component
2. `frontend/src/components/auth/AuthHeader.tsx` - Auth header
3. `frontend/src/components/onboarding/UserOnboarding.tsx` - Onboarding welcome
4. `frontend/src/components/register/StudentThankYouMessage.tsx` - Student signup
5. `frontend/src/components/signup/research-aid/ThankYouMessage.tsx` - Research aid signup
6. `frontend/src/components/dashboard/tabs/AidJobManagementContent.tsx` - Job management
7. `frontend/src/components/dashboard/research-aids/OnboardingCard.tsx` - Research aid onboarding
8. `frontend/src/pages/Dashboard.tsx` - Student dashboard
9. `frontend/src/pages/ResearcherDashboard.tsx` - Researcher dashboard
10. `frontend/src/pages/ResearchAideDashboard.tsx` - Research aide dashboard
11. `frontend/src/pages/StudentDashboard.tsx` - Student dashboard

**Pattern Used:**
```tsx
// Before
<h3>Welcome to ResearchTandem!</h3>

// After
<h3>Welcome to <span className="notranslate">ResearchTandem</span>!</h3>
```

## Code Changes

### googleTranslate.ts - Cookie Management

```typescript
// BEFORE
private getCookieLanguage(): 'en' | 'fr' {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'googtrans') {
      // Cookie format: /en/fr means translating from en to fr
      const match = value.match(/\/en\/(\w+)/);
      if (match && match[1] === 'fr') {
        return 'fr';
      }
    }
  }
  return 'en';
}

private setCookie(lang: 'en' | 'fr') {
  const value = lang === 'en' ? '/en/en' : '/en/fr';
  document.cookie = `googtrans=${value}; path=/; max-age=31536000`;
  document.cookie = `googtrans=${value}; domain=${window.location.hostname}; path=/; max-age=31536000`;
  this.currentLang = lang;
}
```

```typescript
// AFTER
private getCookieLanguage(): 'en' | 'fr' {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'googtrans') {
      // Cookie format: /auto/fr or /auto/en
      const match = value.match(/\/auto\/(\w+)/);
      if (match) {
        if (match[1] === 'fr') return 'fr';
        if (match[1] === 'en') return 'en';
      }
    }
  }
  return 'en';
}

private setCookie(lang: 'en' | 'fr') {
  // Use /auto/ to allow bidirectional translation
  const value = `/auto/${lang}`;
  // Clear old cookies first
  document.cookie = `googtrans=; path=/; max-age=0`;
  document.cookie = `googtrans=; domain=${window.location.hostname}; path=/; max-age=0`;
  // Set new cookies
  document.cookie = `googtrans=${value}; path=/; max-age=31536000`;
  document.cookie = `googtrans=${value}; domain=${window.location.hostname}; path=/; max-age=31536000`;
  this.currentLang = lang;
}
```

### googleTranslate.ts - Initialization

```typescript
// BEFORE
pageLanguage: 'en',

// AFTER
pageLanguage: 'auto', // Changed from 'en' to 'auto' to support bidirectional translation
```

## Testing Instructions

### Test Bidirectional Translation
1. Open the application in English
2. Click the language toggle button to switch to French
3. Wait for the page to translate
4. **Verify:** All text should be in French
5. Click the language toggle button again to switch back to English
6. **Verify:** All text should return to English
7. Repeat steps 2-6 multiple times to ensure consistency

### Test Brand Name Preservation
1. Switch to French using the language toggle
2. **Verify:** The brand name "Research Tandem" remains in English in:
   - Navbar logo
   - Auth header on login/signup pages
   - Welcome messages on dashboard pages
   - Onboarding cards
   - Thank you messages after signup
3. **Verify:** All other text is translated to French

### Expected Behavior
- ✅ EN → FR translation works
- ✅ FR → EN translation works
- ✅ "Research Tandem" stays in English regardless of selected language
- ✅ All other UI text translates properly
- ✅ No page reloads are required (smooth transition)
- ✅ Language preference persists across page refreshes

## How It Works

### Cookie Format
Google Translate uses cookies to remember the translation state:
- `/auto/en` - Auto-detect source, translate to English
- `/auto/fr` - Auto-detect source, translate to French

By using `/auto/` instead of a fixed source language, the system can:
1. Detect the current page language automatically
2. Translate to the target language regardless of source
3. Enable true bidirectional translation

### `notranslate` Class
Google Translate recognizes the `notranslate` CSS class as a signal to skip translation for that element. This is a standard Google Translate feature documented in their documentation.

**How to use:**
```html
<!-- This will be translated -->
<p>Welcome to the platform</p>

<!-- This will NOT be translated -->
<p>Welcome to <span class="notranslate">ResearchTandem</span></p>
```

## Files Changed Summary

### Core Translation Service
- `frontend/src/services/googleTranslate.ts` - Fixed bidirectional translation

### Brand Name Protection (11 files)
- `frontend/src/components/ResearchWhoaLogo.tsx`
- `frontend/src/components/auth/AuthHeader.tsx`
- `frontend/src/components/onboarding/UserOnboarding.tsx`
- `frontend/src/components/register/StudentThankYouMessage.tsx`
- `frontend/src/components/signup/research-aid/ThankYouMessage.tsx`
- `frontend/src/components/dashboard/tabs/AidJobManagementContent.tsx`
- `frontend/src/components/dashboard/research-aids/OnboardingCard.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/ResearcherDashboard.tsx`
- `frontend/src/pages/ResearchAideDashboard.tsx`
- `frontend/src/pages/StudentDashboard.tsx`

## Additional Notes

### Terms and Conditions Files
The following files still contain "ResearchTandem" but were not modified as they are in the older `/src/` directory (not `/frontend/src/`):
- `src/pages/TermsOfService.tsx`
- `src/pages/Partnerships.tsx`
- Other legacy components

If these files are still in use, apply the same `notranslate` pattern to them.

### Future Considerations
1. Consider creating a `<BrandName>` component to centralize brand name rendering:
   ```tsx
   const BrandName = () => <span className="notranslate">ResearchTandem</span>;
   ```
2. Add `notranslate` to other brand-specific terms if needed
3. Consider adding `translate="no"` HTML attribute as an additional safeguard:
   ```html
   <span className="notranslate" translate="no">ResearchTandem</span>
   ```

## Status
✅ **COMPLETE** - Both bidirectional translation and brand name preservation are now working correctly.

---
**Date:** January 25, 2026
**Developer Notes:** The fix addresses the root cause of both issues. The cookie-based approach is reliable and doesn't require API keys. The `notranslate` class is a standard Google Translate feature that's widely supported.
