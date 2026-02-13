/**
 * Cookie Banner Module
 * Handles cookie consent with accessible announcements
 */

export class CookieBanner {
  constructor(element) {
    this.element = element;
    this.confirmationBanner = document.querySelector('[data-module="app-cookie-confirmation"]');
    this.analyticsAccept = element.querySelector('[data-cookie-banner-accept]');
    this.analyticsReject = element.querySelector('[data-cookie-banner-reject]');
    this.hideButton = this.confirmationBanner?.querySelector('[data-cookie-hide]');
    this.confirmationMessage = this.confirmationBanner?.querySelector('[data-cookie-confirmation-message]');
    this.analyticsConfig = null;
    this.init();
  }

  async init() {
    // Load analytics config
    await this.loadAnalyticsConfig();
    // If consent already given, enable analytics if accepted and config allows
    if (this.hasConsent()) {
      if (this.getCookie('cookie_consent_analytics') === 'accepted') {
        this.enableAnalytics();
      }
      return;
    }
    // Show banner
    this.element.hidden = false;
    // Bind events for analytics
    this.analyticsAccept?.addEventListener('click', () => this.handleChoice('analytics', 'accepted'));
    this.analyticsReject?.addEventListener('click', () => this.handleChoice('analytics', 'rejected'));
    // Hide confirmation
    this.hideButton?.addEventListener('click', () => this.hideConfirmation());
  }

  async loadAnalyticsConfig() {
    try {
      const res = await fetch('/src/data/analytics.json');
      if (res.ok) {
        this.analyticsConfig = await res.json();
      } else {
        this.analyticsConfig = {};
      }
    } catch (e) {
      this.analyticsConfig = {};
    }
  }
  
  hasConsent() {
    return document.cookie.includes('cookie_consent_analytics=');
  }
  
  handleChoice(type, value) {
    // Set cookie for analytics only
    document.cookie = `cookie_consent_analytics=${value}; max-age=31536000; path=/; SameSite=Lax`;
    // Hide main banner
    this.element.hidden = true;
    // Show confirmation
    if (this.confirmationBanner && this.confirmationMessage) {
      let analytics = this.getCookie('cookie_consent_analytics');
      let message = `You have ${analytics === 'accepted' ? 'accepted' : 'rejected'} analytics cookies. You can <a href="/cookies/" class="govuk-link">change your cookie settings</a> at any time.`;
      this.confirmationMessage.innerHTML = message;
      this.confirmationBanner.hidden = false;
      this.confirmationBanner.focus();
    }
    // Trigger analytics if accepted
    if (type === 'analytics' && value === 'accepted') {
      this.enableAnalytics();
    }
  }
  
  getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  
  hideConfirmation() {
    if (this.confirmationBanner) {
      this.confirmationBanner.hidden = true;
    }
  }
  
  enableAnalytics() {
    // Only inject analytics if config is loaded and enabled
    if (!this.analyticsConfig) return;
    // Google Analytics
    if (this.analyticsConfig.googleAnalytics && this.analyticsConfig.googleAnalytics.enabled && this.analyticsConfig.googleAnalytics.trackingId) {
      if (!window.gaLoaded) {
        window.gaLoaded = true;
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.analyticsConfig.googleAnalytics.trackingId}`;
        document.head.appendChild(gaScript);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', this.analyticsConfig.googleAnalytics.trackingId);
      }
    }
    // Google Tag Manager
    if (this.analyticsConfig.googleTagManager && this.analyticsConfig.googleTagManager.enabled && this.analyticsConfig.googleTagManager.containerId) {
      if (!window.gtmLoaded) {
        window.gtmLoaded = true;
        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${this.analyticsConfig.googleTagManager.containerId}`;
        document.head.appendChild(gtmScript);
      }
    }
    // Facebook Pixel (future)
    if (this.analyticsConfig.facebookPixel && this.analyticsConfig.facebookPixel.enabled && this.analyticsConfig.facebookPixel.pixelId) {
      if (!window.fbqLoaded) {
        window.fbqLoaded = true;
        !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
        })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', this.analyticsConfig.facebookPixel.pixelId);
        window.fbq('track', 'PageView');
      }
    }
  }
}

// Allow reopening the cookie banner from the cookies page
document.addEventListener('DOMContentLoaded', () => {
  const changeBtn = document.getElementById('change-cookie-settings');
  const banner = document.querySelector('[data-module="app-cookie-banner"]');
  if (changeBtn && banner) {
    changeBtn.addEventListener('click', () => {
      // Remove consent cookie
      document.cookie = 'cookie_consent_analytics=; max-age=0; path=/; SameSite=Lax';
      // Show banner again
      banner.hidden = false;
      // Optionally hide confirmation if visible
      const confirmation = document.querySelector('[data-module="app-cookie-confirmation"]');
      if (confirmation) confirmation.hidden = true;
      // Move focus for accessibility
      banner.focus();
    });
  }
});
