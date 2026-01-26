# Translation System - Testing Guide

## Quick Test Procedure

### 1. Start the Application
```bash
npm run dev
```

### 2. Test on Localhost

#### Test English → French:
1. Open the app in your browser
2. Click the language toggle (FR flag or button)
3. **Expected**: Page should reload and content should be in French
4. **Verify**: "Research Tandem" logo stays as "Research Tandem" (not "Recherche Tandem")

#### Test French → English:
1. With page in French, click language toggle (EN flag or button)
2. **Expected**: Page should reload and return to English
3. **Verify**: All content back to English

#### Check Brand Names:
1. Navigate to different pages (Home, About, Terms of Service)
2. **Verify**: "Research Tandem", "ResearchTandem" never translate
3. Check DevTools: Look for `<span class="notranslate">` around brand names

#### Debug Console:
Open browser console and look for:
```
Google Translate script loaded
Google Translate Element Init called
Google Translate Element created
Changing language to: fr, current: en
Cookie set for fr: googtrans=/auto/fr; ...
```

### 3. Test on VPS (After Deployment)

#### Same tests as localhost, plus:

1. **Cookie Persistence**:
   - Switch to French
   - Close browser completely
   - Reopen and visit site
   - **Expected**: Still in French

2. **Cross-page Navigation**:
   - Switch to French on home page
   - Navigate to other pages
   - **Expected**: All pages in French

3. **Domain Cookies**:
   - Open DevTools → Application → Cookies
   - **Verify**: `googtrans` cookie exists with correct domain

### 4. Manual Cookie Check

Open browser console:
```javascript
// Check current cookies
console.log(document.cookie);

// Should show: googtrans=/auto/fr (or /auto/en)

// Check language detection
console.log(document.documentElement.lang);
console.log(document.documentElement.classList.contains('translated-ltr'));
```

### 5. Test Brand Name Protection API

Open console and run:
```javascript
// Import the service (if in dev tools, it's already loaded)
const { googleTranslate } = window;

// Protect specific elements
googleTranslate.protectElementsBySelector('.my-brand-class');

// Check protection
const brandEl = document.querySelector('.my-brand-class');
console.log(brandEl.classList.contains('notranslate')); // Should be true
```

---

## Common Issues and Solutions

### Issue: Translation not happening
**Solution**:
1. Check Network tab: Google Translate script loaded?
2. Check console: Any errors?
3. Try hard reload: Ctrl+Shift+R
4. Clear cookies and retry

### Issue: Brand names translating
**Solution**:
1. Check if `notranslate` class exists: DevTools → Elements
2. Verify CSS loaded: Check `.notranslate` style rules
3. Check console for MutationObserver errors
4. Manually protect: `googleTranslate.protectElementsBySelector('.brand')`

### Issue: Can't switch back to English
**Solution**:
1. Clear Google Translate cookies:
   ```javascript
   document.cookie = 'googtrans=; max-age=0; path=/';
   ```
2. Reload page
3. Check if page still has `translated-ltr` class

### Issue: VPS not working but localhost works
**Solution**:
1. Check domain in cookie:
   ```javascript
   console.log(document.cookie);
   ```
2. Verify SameSite policy allows cookie
3. Check HTTPS (some features need secure context)
4. Try with leading dot: `.yourdomain.com`

---

## Expected Console Output

### On Page Load (English):
```
Google Translate script loaded
Google Translate Element Init called
Google Translate Element created
```

### On Language Change to French:
```
Changing language to: fr, current: en
Cookie set for fr: googtrans=/auto/fr; path=/; max-age=31536000; SameSite=Lax
Select element found, changing value
```

### On Page Reload (stays French):
```
Google Translate script loaded
Google Translate Element Init called  
Google Translate Element created
```

---

## Automated Testing (Optional)

If you want to add automated tests:

```typescript
// test/translation.test.ts
import { describe, it, expect } from 'vitest';
import { googleTranslate } from '@/services/googleTranslate';

describe('Google Translate Service', () => {
  it('should detect language from cookie', () => {
    document.cookie = 'googtrans=/auto/fr';
    expect(googleTranslate.getCurrentLanguage()).toBe('fr');
  });

  it('should protect elements with notranslate class', () => {
    const el = document.createElement('div');
    el.textContent = 'Research Tandem';
    document.body.appendChild(el);
    
    googleTranslate.protectElement(el);
    expect(el.classList.contains('notranslate')).toBe(true);
  });
});
```

---

## Performance Testing

Check performance impact:

1. Open DevTools → Performance
2. Start recording
3. Switch language
4. Stop recording
5. **Verify**: No long tasks, no memory leaks

### Expected Metrics:
- Cookie operations: < 1ms
- MutationObserver overhead: < 5ms per mutation
- Page reload time: Normal (depends on network)

---

## Browser Compatibility Testing

Test on:
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Edge (Desktop)
- [ ] Chrome (Mobile/Android)
- [ ] Safari (iOS)

---

## Checklist Before Deployment

- [ ] All TypeScript errors fixed
- [ ] Translation works localhost
- [ ] Brand names protected
- [ ] Bidirectional translation works
- [ ] Console has no errors
- [ ] Cookies set correctly
- [ ] CSS rules loaded
- [ ] MutationObserver running
- [ ] Public API methods work
- [ ] Documentation complete

---

## Deployment Steps

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to VPS**:
   - Upload `dist` folder
   - Configure web server (nginx/apache)
   - Ensure HTTPS enabled

3. **Test on production**:
   - Run all tests from section 3
   - Check cookies persist
   - Verify brand names protected

4. **Monitor**:
   - Check browser console for errors
   - Monitor user reports
   - Check analytics for language usage

---

## Success Criteria

✅ Translation works in both directions (EN ↔ FR)  
✅ Brand names never translate  
✅ Works on localhost and VPS  
✅ Cookies persist correctly  
✅ No TypeScript errors  
✅ No console errors  
✅ Fast and smooth user experience  

---

## Support

If you encounter issues:

1. Check this guide first
2. Review `TRANSLATION_SYSTEM_FIX.md` for technical details
3. Check Google Translate Widget documentation
4. Check browser console for specific errors
5. Test in incognito mode (rules out extension interference)

---

**Last Updated**: January 26, 2026  
**Status**: ✅ Ready for Testing
