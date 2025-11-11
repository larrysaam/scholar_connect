import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
// import { componentTagger } from "lovable-tagger"; // Temporarily disabled

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.svg', 'pwa-icon.svg'],
      manifest: {
        name: 'ResearchWow - Academic Consultation Platform',
        short_name: 'ResearchWow',
        description: 'Connect students with researchers and research aids for thesis and academic support',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        id: '/',
        lang: 'en',
        dir: 'ltr',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        categories: ['education', 'productivity', 'utilities'],
        shortcuts: [
          {
            name: 'Find Researchers',
            short_name: 'Researchers',
            description: 'Browse and connect with verified researchers',
            url: '/researchers',
            icons: [{ src: 'pwa-icon.svg', sizes: '192x192' }]
          },
          {
            name: 'My Dashboard',
            short_name: 'Dashboard',
            description: 'Access your personalized dashboard',
            url: '/dashboard',
            icons: [{ src: 'pwa-icon.svg', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,webp,woff}'],
        // Precache all app shell components and critical routes
        additionalManifestEntries: [
          { url: '/', revision: null },
          { url: '/dashboard', revision: null },
          { url: '/researchers', revision: null },
          { url: '/appointments', revision: null },
          { url: '/profile', revision: null },
          { url: '/offline', revision: null },
          { url: '/login', revision: null },
          { url: '/signup', revision: null }
        ],
        // Skip waiting to ensure immediate updates
        skipWaiting: true,
        clientsClaim: true,
        // Increase cache size limits
        maximumFileSizeToCacheInBytes: 5000000, // 5MB
        runtimeCaching: [
          // App shell - Network first for fresh content, cache for offline
          {
            urlPattern: /^\/(?:(dashboard|researchers|profile|appointments|jobs|login|signup|offline)(?:\/.*)?)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          },
          // API calls - Network first with offline fallback
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 2 // 2 hours
              }
            }
          },
          // Supabase Auth - Cache for offline access
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-auth-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          },
          // Static assets - Cache first
          {
            urlPattern: /\.(?:js|css|html)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          // Images and icons
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ],
        // Offline fallback
        navigateFallback: '/offline',
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        navigateFallbackDenylist: [/^\/__.*$/]
      },
      devOptions: {
        enabled: true
      }
    }),
    // mode === 'development' &&
    // componentTagger(), // Temporarily disabled
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
