/**
 * Main JavaScript entry point
 * Initialises GOV.UK Frontend and custom modules
 */

// Import GOV.UK Frontend
import { initAll } from 'govuk-frontend';

// Import custom modules
import { CookieBanner } from './modules/cookie-banner.js';
import { DataTable } from './modules/data-table.js';
import { Chart } from './modules/chart.js';
import { FormValidation } from './modules/form-validation.js';
import { ContractsTable } from './modules/contracts-table.js';
import { StatisticsDashboard } from './modules/statistics-dashboard.js';
import { HeaderNavigation } from './modules/header-navigation.js';

/**
 * Initialise all modules when DOM is ready
 */
function init() {
  // Initialise GOV.UK Frontend components
  initAll();
  
  // Initialise header navigation
  initModule('[data-module="app-header"]', HeaderNavigation);
  
  // Initialise custom modules
  initModule('[data-module="app-cookie-banner"]', CookieBanner);
  initModule('[data-module="app-data-table"]', DataTable);
  initModule('[data-module="app-chart"]', Chart);
  initModule('[data-module="app-form-validation"]', FormValidation);
  initModule('[data-module="app-contracts-table"]', ContractsTable);
  initModule('[data-module="app-statistics-dashboard"]', StatisticsDashboard);
}

/**
 * Helper to initialise a module on matching elements
 * @param {string} selector - CSS selector
 * @param {Function} ModuleClass - Module constructor
 */
function initModule(selector, ModuleClass) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    try {
      new ModuleClass(element);
    } catch (error) {
      console.error(`Error initialising module on ${selector}:`, error);
    }
  });
}

// Initialise when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential external use
export { init };
