// 📍 Geolocation
export {
  useGeolocationAdvanced,
  type UseGeolocationAdvancedOptions,
  type GeolocationError,
} from '@/lib/hooks/use-geolocation-advanced'
export { LocationPermissionModal } from '@/components/shared/location-permission-modal'

// 🚀 PWA
export {
  initializePWA,
  showInstallPrompt,
  isInstallable,
  isInstalled,
  registerServiceWorker,
  unregisterServiceWorker,
  syncOfflineReviews,
  getPWAInstallationState,
  registerBackgroundSync,
} from '@/lib/utils/pwa-install'
export { InstallPrompt } from '@/components/shared/install-prompt'

// 🖼️ Image Optimization
export {
  generateBlurPlaceholder,
  optimizeForWeb,
  generateResponsiveSizes,
  convertToWebP,
  convertToAVIF,
  getImageMetadata,
  setupLazyLoading,
  checkImageFormatSupport,
  validateImage,
  generateSrcSet,
  calculateCompressionRatio,
  generateDensitySrcSet,
  generatePictureElement,
} from '@/lib/utils/image-optimization'
export {
  OptimizedImage,
  LazyImage,
  ResponsiveImage,
  ImageGallery,
} from '@/components/shared/optimized-image'

// ⚡ Performance
export {
  initializePerformanceMonitoring,
  getPerformanceMetrics,
  resetPerformanceMetrics,
  sendMetricsToAnalytics,
  measureOperation,
  monitorMemoryUsage,
  analyzeResources,
  generatePerformanceReport,
  type PerformanceMetrics,
  type PerformanceThresholds,
} from '@/lib/utils/performance-monitoring'
export {
  PerformanceObserver,
  usePerformanceMonitoring,
  useRenderDuration,
  useLongTaskDetector,
  useDOMMutationMonitoring,
  useScrollPerformance,
  useAnimationPerformance,
  useUserEventPerformance,
  useNetworkMonitoring,
} from '@/components/shared/performance-observer'

// 💾 Cache
export {
  cacheRankingData,
  getRankingData,
  invalidateRankingCache,
  cacheStatistics,
  getStatistics,
  invalidateStatisticsCache,
  cacheBurgerData,
  getBurgerData,
  invalidateBurgerCache,
  setCache,
  getCache,
  hasCache,
  deleteCache,
  clearAllCache,
  getCacheStats,
  useSWR,
  dedupeRequest,
  buildCacheHeaders,
  buildCDNCacheHeaders,
  getRedisCached,
  warmupCache,
  scheduleInvalidation,
  type CacheEntry,
  type CacheOptions,
  type CacheStats,
} from '@/lib/utils/cache-strategy'

// 📊 Analytics
export {
  initializeAnalytics,
  trackEvent,
  trackPageView,
  trackBurgerView,
  trackBurgerRating,
  trackBurgerRatingCancel,
  trackReviewSubmit,
  trackReviewHelpful,
  trackRankingFilter,
  trackRankingSort,
  trackSearch,
  trackSearchResultClick,
  trackRewardEarned,
  trackBadgeUnlocked,
  trackSocialShare,
  trackAppInstall,
  trackPreferenceChange,
  trackError,
  trackPerformanceIssue,
  setUserProperties,
  getUserProperties,
  getSessionId,
  getEventBuffer,
  clearEventBuffer,
  type AnalyticsEvent,
  type UserProperties,
  type EventName,
} from '@/lib/analytics/events'
export {
  startSession,
  recordPageView,
  recordUserEvent,
  endSession,
  defineFunnel,
  trackFunnelStep,
  getFunnelMetrics,
  defineABTest,
  assignVariant,
  recordABTestConversion,
  getABTestMetrics,
  getWinningVariant,
  getActiveSessions,
  getUserBehavior,
  calculateAggregateStats,
  getTopUsers,
  trackPopularSearches,
  trackMostViewedBurgers,
  cleanupInactiveSessions,
  type UserSession,
  type UserBehavior,
  type ConversionFunnel,
  type ABTestVariant,
} from '@/lib/analytics/user-behavior'
export {
  AnalyticsProvider,
  useAnalytics,
  CookieConsentManager,
  useTrackEvent,
  withAnalyticsTracking,
} from '@/components/shared/analytics-provider'

// ❌ Error Handling
export {
  logError,
  logWarning,
  logInfo,
  logCriticalError,
  getErrorLogs,
  clearErrorLogs,
  withErrorHandling,
  ErrorBoundary,
  initializeErrorLogging,
  type ErrorContext,
  type ErrorLog,
} from '@/lib/utils/error-logger'

// 🔍 SEO
export {
  generateMetadata,
  generateOrganizationStructuredData,
  generateBurgerStructuredData,
  generateRestaurantStructuredData,
  generateReviewStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
  generateSitemap,
  generateRobotsTxt,
  injectMetaTags,
  injectStructuredData,
  setCanonicalUrl,
  validatePageSEO,
  type SEOMetadata,
  type StructuredData,
} from '@/lib/utils/seo'

// ♿ Accessibility
export {
  announceToScreenReader,
  trapFocus,
  manageFocusOnRouteChange,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkMode,
  getUserAccessibilityPreferences,
  applyAccessibilitySettings,
  setAriaAttributes,
  validateElementAccessibility,
  initializeAccessibility,
  type AccessibilityOptions,
} from '@/lib/utils/accessibility'
export { SkipToContent } from '@/components/shared/skip-to-content'
