/**
 * Cookie Banner Module
 * Handles cookie consent with accessible announcements
 */

export class CookieBanner {
  constructor(element) {
    this.element = element;
    this.confirmationBanner = document.querySelector('[data-module="app-cookie-confirmation"]');
    this.analyticsYes = element.querySelector('[data-cookie-choice="analytics-yes"]');
    this.analyticsNo = element.querySelector('[data-cookie-choice="analytics-no"]');
    this.marketingYes = element.querySelector('[data-cookie-choice="marketing-yes"]');
    this.marketingNo = element.querySelector('[data-cookie-choice="marketing-no"]');
    this.hideButton = this.confirmationBanner?.querySelector('[data-cookie-hide]');
    this.confirmationMessage = this.confirmationBanner?.querySelector('[data-cookie-confirmation-message]');
    this.init();
  }
  
  init() {
    // Check if consent already given
    if (this.hasConsent()) {
      return;
    }
    // Show banner
    this.element.hidden = false;
    // Bind events for analytics
    this.analyticsYes?.addEventListener('click', () => this.handleChoice('analytics', 'accepted'));
    this.analyticsNo?.addEventListener('click', () => this.handleChoice('analytics', 'rejected'));
    // Bind events for marketing
    this.marketingYes?.addEventListener('click', () => this.handleChoice('marketing', 'accepted'));
    this.marketingNo?.addEventListener('click', () => this.handleChoice('marketing', 'rejected'));
    // Hide confirmation
    this.hideButton?.addEventListener('click', () => this.hideConfirmation());
  }
  
  hasConsent() {
    return document.cookie.includes('cookie_consent_analytics=') && document.cookie.includes('cookie_consent_marketing=');
  }
  
  handleChoice(type, value) {
    // Set cookie for the type
    document.cookie = `cookie_consent_${type}=${value}; max-age=31536000; path=/; SameSite=Lax`;
    // Hide main banner if both choices made
    const analyticsConsent = document.cookie.includes('cookie_consent_analytics=');
    const marketingConsent = document.cookie.includes('cookie_consent_marketing=');
    if (analyticsConsent && marketingConsent) {
      this.element.hidden = true;
      // Show confirmation
      if (this.confirmationBanner && this.confirmationMessage) {
        let analytics = this.getCookie('cookie_consent_analytics');
        let marketing = this.getCookie('cookie_consent_marketing');
        let message = `You have ${analytics === 'accepted' ? 'accepted' : 'rejected'} analytics cookies and ${marketing === 'accepted' ? 'accepted' : 'rejected'} communications and marketing cookies. You can <a href="/cookies/" class="govuk-link">change your cookie settings</a> at any time.`;
        this.confirmationMessage.innerHTML = message;
        this.confirmationBanner.hidden = false;
        this.confirmationBanner.focus();
      }
      // Trigger analytics if accepted (placeholder)
      if (type === 'analytics' && value === 'accepted') {
        this.enableAnalytics();
      }
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
    // Placeholder for analytics initialization
    // In production, this would load your analytics script
    console.log('Analytics cookies accepted - analytics would be enabled here');
  }
}

// Allow reopening the cookie banner from the cookies page
document.addEventListener('DOMContentLoaded', () => {
  const changeBtn = document.getElementById('change-cookie-settings');
  const banner = document.querySelector('[data-module="app-cookie-banner"]');
  if (changeBtn && banner) {
    changeBtn.addEventListener('click', () => {
      // Remove consent cookies
      document.cookie = 'cookie_consent_analytics=; max-age=0; path=/; SameSite=Lax';
      document.cookie = 'cookie_consent_marketing=; max-age=0; path=/; SameSite=Lax';
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
