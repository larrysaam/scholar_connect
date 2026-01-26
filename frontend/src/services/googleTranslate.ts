// Google Translate Service using Cookie-based approach
// This provides reliable client-side translation without needing API keys

export class GoogleTranslateService {
  private static instance: GoogleTranslateService;
  private initialized = false;
  private currentLang: 'en' | 'fr' = 'en';
  private translationTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    // Check if there's a language in cookie
    this.currentLang = this.getCookieLanguage();
    
    // Protect brand names from translation
    this.protectBrandNames();
  }

  static getInstance(): GoogleTranslateService {
    if (!GoogleTranslateService.instance) {
      GoogleTranslateService.instance = new GoogleTranslateService();
    }
    return GoogleTranslateService.instance;
  }

  // Protect brand names and key terms from translation
  private protectBrandNames() {
    // Add notranslate class to brand names dynamically
    const observer = new MutationObserver(() => {
      this.markBrandNames();
    });

    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Initial marking
    setTimeout(() => this.markBrandNames(), 500);
  }
  // Mark brand names with notranslate class
  private markBrandNames() {
    const brandNames = [
      'Research Tandem',
      'ResearchTandem',
      'Scholar Consult Connect'
    ];

    // Use TreeWalker to find all text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Node[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const nodeValue = textNode.nodeValue || '';
      const parent = textNode.parentElement;

      // Skip if already protected or no parent
      if (!parent || parent.classList.contains('notranslate')) {
        return;
      }

      brandNames.forEach(brandName => {
        if (nodeValue.includes(brandName)) {
          // Wrap brand name in notranslate span
          const regex = new RegExp(`(${brandName})`, 'gi');
          const newHTML = nodeValue.replace(regex, '<span class="notranslate">$1</span>');
          
          if (newHTML !== nodeValue) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHTML;
            
            // Insert all children before the text node
            while (tempDiv.firstChild) {
              parent.insertBefore(tempDiv.firstChild, textNode);
            }
            
            // Remove the original text node using parentNode.removeChild
            if (textNode.parentNode) {
              textNode.parentNode.removeChild(textNode);
            }
          }
        }
      });
    });
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
  }  // Get language from Google Translate cookie
  private getCookieLanguage(): 'en' | 'fr' {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'googtrans') {
        // Cookie format: /auto/fr or /auto/en or /en/fr
        const match = value.match(/\/(?:auto|en|fr)\/(\w+)/);
        if (match) {
          const lang = match[1];
          if (lang === 'fr') return 'fr';
          if (lang === 'en') return 'en';
        }
      }
    }
    
    // Check if page is already translated
    if (document.documentElement.classList.contains('translated-ltr') || 
        document.documentElement.classList.contains('translated-rtl')) {
      // Try to detect from HTML lang attribute or other indicators
      const htmlLang = document.documentElement.lang;
      if (htmlLang === 'fr') return 'fr';
    }
    
    return 'en';
  }
  // Set Google Translate cookie
  private setCookie(lang: 'en' | 'fr') {
    // Use /auto/ to allow bidirectional translation
    const value = `/auto/${lang}`;
    const domain = window.location.hostname;
    const path = '/';
    const maxAge = 31536000; // 1 year
    
    // Clear old cookies first (try multiple variations)
    const clearOptions = [
      `googtrans=; path=${path}; max-age=0`,
      `googtrans=; domain=${domain}; path=${path}; max-age=0`,
      `googtrans=; domain=.${domain}; path=${path}; max-age=0`,
    ];
    
    clearOptions.forEach(option => {
      document.cookie = option;
    });
    
    // Set new cookies with multiple variations for better VPS compatibility
    const setOptions = [
      `googtrans=${value}; path=${path}; max-age=${maxAge}; SameSite=Lax`,
      `googtrans=${value}; domain=${domain}; path=${path}; max-age=${maxAge}; SameSite=Lax`,
    ];
    
    // Add domain with leading dot for subdomains (if not localhost)
    if (!domain.includes('localhost') && !domain.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      setOptions.push(`googtrans=${value}; domain=.${domain}; path=${path}; max-age=${maxAge}; SameSite=Lax`);
    }
    
    setOptions.forEach(option => {
      document.cookie = option;
    });
    
    this.currentLang = lang;
    console.log(`Cookie set for ${lang}:`, document.cookie);
  }
  // Change language using cookie method and reload
  changeLanguage(targetLang: 'en' | 'fr') {
    console.log(`Changing language to: ${targetLang}, current: ${this.currentLang}`);
    
    // If switching to same language, do nothing
    if (this.currentLang === targetLang) {
      console.log('Already in target language');
      return;
    }

    // Set the cookie first
    this.setCookie(targetLang);
    
    // Try to trigger translation through widget
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (selectElement) {
      console.log('Select element found, changing value');
      selectElement.value = targetLang;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Wait and check if translation happened
      setTimeout(() => {
        const isNowTranslated = this.isTranslated();
        const needsTranslation = targetLang !== 'en';
        
        if (!isNowTranslated && needsTranslation) {
          console.log('Translation did not happen, reloading page');
          window.location.reload();
        } else if (isNowTranslated && !needsTranslation) {
          // Switching back to English but page is still translated
          console.log('Need to reload to show English');
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

  // Public method to protect specific elements from translation
  protectElement(element: HTMLElement) {
    if (!element.classList.contains('notranslate')) {
      element.classList.add('notranslate');
    }
  }

  // Public method to protect elements by selector
  protectElementsBySelector(selector: string) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        this.protectElement(el);
      }
    });
  }
}

export const googleTranslate = GoogleTranslateService.getInstance();
