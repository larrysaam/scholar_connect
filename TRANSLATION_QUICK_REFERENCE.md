# 🚀 Quick Reference Card - Translation System

## ⚡ Quick Start

### Test Translation (Localhost)
```bash
cd frontend
npm run dev
# Open browser → Click language toggle → Verify translation
```

### Verify Brand Protection
- Check logo: "Research Tandem" stays English ✓
- Switch to French: Logo should NOT become "Recherche Tandem"
- Open DevTools: Look for `<span class="notranslate">` tags

### Debug Cookies
```javascript
// In browser console:
console.log(document.cookie); // Should show: googtrans=/auto/fr
```

---

## 🔧 API Reference

### Protect Elements from Translation

```typescript
import { googleTranslate } from '@/services/googleTranslate';

// Protect a single element
const element = document.getElementById('brand-name');
if (element) {
  googleTranslate.protectElement(element);
}

// Protect all elements with a class
googleTranslate.protectElementsBySelector('.brand-name');
```

### Get Current Language
```typescript
const currentLang = googleTranslate.getCurrentLanguage(); // 'en' | 'fr'
```

---

## 📝 Brand Names Protected

Automatically protected (no action needed):
- ✅ "Research Tandem"
- ✅ "ResearchTandem"  
- ✅ "Scholar Consult Connect"

To add more:
```typescript
// Edit: frontend/src/services/googleTranslate.ts
const brandNames = [
  'Research Tandem',
  'ResearchTandem',
  'Scholar Consult Connect',
  'Your New Brand Name' // Add here
];
```

---

## 🐛 Common Issues

### Translation not working?
```bash
# 1. Hard reload
Ctrl + Shift + R

# 2. Clear cookies
document.cookie = 'googtrans=; max-age=0; path=/'

# 3. Check console for errors
F12 → Console
```

### Brand name translating?
```javascript
// Manual protection:
googleTranslate.protectElementsBySelector('.your-brand-class');
```

### Can't switch back to English?
```javascript
// Clear all translation cookies
document.cookie.split(';').forEach(c => {
  document.cookie = c.trim().split('=')[0] + '=; max-age=0';
});
location.reload();
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `googleTranslate.ts` | Core translation service |
| `LanguageContext.tsx` | React context & initialization |
| `LanguageToggle.tsx` | UI toggle component |
| `ResearchWhoaLogo.tsx` | Logo with brand protection |

---

## ✅ Testing Checklist

- [ ] EN → FR translation works
- [ ] FR → EN translation works
- [ ] "Research Tandem" never translates
- [ ] Logo stays in English
- [ ] Cookie persists after reload
- [ ] No console errors
- [ ] Works on localhost
- [ ] Works on VPS

---

## 🚨 Emergency Rollback

If translation breaks production:

```typescript
// Disable Google Translate temporarily
// In: frontend/src/contexts/LanguageContext.tsx
useEffect(() => {
  // Comment out this line:
  // googleTranslate.initialize(...);
}, []);
```

Then redeploy. Site will work in English only.

---

## 📊 Expected Behavior

### English (Default):
- Page loads in English
- Cookie: `googtrans=/auto/en` or empty
- No `translated-ltr` class on `<html>`

### French:
- User clicks FR toggle
- Page reloads
- Cookie: `googtrans=/auto/fr`
- `<html>` has `translated-ltr` class
- Content in French, brand names in English

### Back to English:
- User clicks EN toggle  
- Page reloads
- Cookie cleared or set to `/auto/en`
- No `translated-ltr` class
- All content back to English

---

## 🎯 Success Criteria

✅ Bidirectional translation (EN ↔ FR)  
✅ Brand names protected  
✅ Works on localhost  
✅ Works on VPS  
✅ No TypeScript errors  
✅ No console errors  
✅ Smooth user experience  

---

## 📞 Support Files

- **Technical**: `TRANSLATION_SYSTEM_FIX.md`
- **Testing**: `TRANSLATION_TESTING_GUIDE.md`
- **Complete**: `COMPLETE_FIX_SUMMARY.md`

---

**Version**: 1.0  
**Date**: January 26, 2026  
**Status**: ✅ Ready to Use
