/**
 * Cookie Banner Module
 * Handles cookie consent with accessible announcements
 */

export class CookieBanner {
  constructor(element) {
    this.element = element;
    this.confirmationBanner = document.querySelector('[data-module="app-cookie-confirmation"]');
    this.acceptButton = element.querySelector('[data-cookie-choice="accept"]');
    this.rejectButton = element.querySelector('[data-cookie-choice="reject"]');
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
    
    // Bind events
    this.acceptButton?.addEventListener('click', () => this.handleChoice('accept'));
    this.rejectButton?.addEventListener('click', () => this.handleChoice('reject'));
    this.hideButton?.addEventListener('click', () => this.hideConfirmation());
  }
  
  hasConsent() {
    return document.cookie.includes('cookie_consent=');
  }
  
  handleChoice(choice) {
    // Set cookie
    const value = choice === 'accept' ? 'accepted' : 'rejected';
    document.cookie = `cookie_consent=${value}; max-age=31536000; path=/; SameSite=Lax`;
    
    // Hide main banner
    this.element.hidden = true;
    
    // Show confirmation
    if (this.confirmationBanner && this.confirmationMessage) {
      const message = choice === 'accept'
        ? 'You have accepted analytics cookies. You can <a href="/cookies/" class="govuk-link">change your cookie settings</a> at any time.'
        : 'You have rejected analytics cookies. You can <a href="/cookies/" class="govuk-link">change your cookie settings</a> at any time.';
      
      this.confirmationMessage.innerHTML = message;
      this.confirmationBanner.hidden = false;
      
      // Move focus for accessibility
      this.confirmationBanner.focus();
    }
    
    // Trigger analytics if accepted (placeholder)
    if (choice === 'accept') {
      this.enableAnalytics();
    }
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
