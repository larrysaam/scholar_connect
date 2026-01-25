// Google Translate Service using Cookie-based approach
// This provides reliable client-side translation without needing API keys

export class GoogleTranslateService {
  private static instance: GoogleTranslateService;
  private initialized = false;
  private currentLang: 'en' | 'fr' = 'en';

  private constructor() {
    // Check if there's a language in cookie
    this.currentLang = this.getCookieLanguage();
  }

  static getInstance(): GoogleTranslateService {
    if (!GoogleTranslateService.instance) {
      GoogleTranslateService.instance = new GoogleTranslateService();
    }
    return GoogleTranslateService.instance;
  }

  // Initialize Google Translate Widget
  initialize(callback?: () => void) {
    if (this.initialized) {
      callback?.();
      return;
    }

    // Check if script already exists
    if (document.getElementById('google-translate-script')) {
      this.initialized = true;
      callback?.();
      return;
    }

    // Add Google Translate script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    script.onload = () => {
      this.initialized = true;
      console.log('Google Translate script loaded');
      callback?.();
    };

    script.onerror = () => {
      console.error('Failed to load Google Translate script');
    };

    document.body.appendChild(script);    // Define global callback for Google Translate
    (window as any).googleTranslateElementInit = () => {
      console.log('Google Translate Element Init called');
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'auto', // Changed from 'en' to 'auto' to support bidirectional translation
            includedLanguages: 'en,fr',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        console.log('Google Translate Element created');
        
        // Apply current language after initialization
        setTimeout(() => {
          if (this.currentLang !== 'en') {
            this.changeLanguage(this.currentLang);
          }
        }, 1000);
      }
    };
  }
  // Get language from Google Translate cookie
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

  // Set Google Translate cookie
  private setCookie(lang: 'en' | 'fr') {
    // Use /auto/ to allow bidirectional translation
    const value = `/auto/${lang}`;
    // Clear old cookies first
    document.cookie = `googtrans=; path=/; max-age=0`;
    document.cookie = `googtrans=; domain=${window.location.hostname}; path=/; max-age=0`;
    // Set new cookies
    document.cookie = `googtrans=${value}; path=/; max-age=31536000`; // 1 year
    document.cookie = `googtrans=${value}; domain=${window.location.hostname}; path=/; max-age=31536000`;
    this.currentLang = lang;
  }

  // Change language using cookie method and reload
  changeLanguage(targetLang: 'en' | 'fr') {
    console.log(`Changing language to: ${targetLang}`);
    
    // If switching to same language, do nothing
    if (this.currentLang === targetLang) {
      console.log('Already in target language');
      return;
    }

    // Set the cookie
    this.setCookie(targetLang);
    
    // Try to trigger translation through widget
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (selectElement) {
      console.log('Select element found, changing value');
      selectElement.value = targetLang;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Wait a bit and check if translation happened
      setTimeout(() => {
        if (!this.isTranslated() && targetLang !== 'en') {
          console.log('Translation did not happen, reloading page');
          window.location.reload();
        }
      }, 1500);
    } else {
      // Widget not ready, reload page with cookie set
      console.log('Widget not ready, reloading page');
      window.location.reload();
    }
  }

  // Check if page is currently translated
  private isTranslated(): boolean {
    return document.documentElement.classList.contains('translated-ltr') ||
           document.documentElement.classList.contains('translated-rtl') ||
           document.documentElement.lang !== 'en';
  }

  // Remove Google Translate artifacts (cleanup)
  cleanup() {
    // Remove the top banner
    const topBanner = document.querySelector('.skiptranslate');
    if (topBanner) {
      topBanner.remove();
    }

    // Remove iframe overlay
    const iframe = document.querySelector('iframe.goog-te-banner-frame');
    if (iframe) {
      iframe.remove();
    }

    // Reset body top style
    document.body.style.top = '0';
  }

  // Check if translation is active
  isTranslating(): boolean {
    return this.isTranslated();
  }

  // Get current language
  getCurrentLanguage(): 'en' | 'fr' {
    return this.currentLang;
  }
}

export const googleTranslate = GoogleTranslateService.getInstance();
