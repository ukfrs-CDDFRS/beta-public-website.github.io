/**
 * Statistics Dashboard Module
 * Handles dynamic loading and updating of statistics
 */

export class StatisticsDashboard {
  constructor(element) {
    this.element = element;
    this.dataUrl = element.dataset.statisticsUrl;
    this.data = null;
    
    this.init();
  }
  
  async init() {
    if (this.dataUrl) {
      try {
        this.data = await this.fetchData();
        this.enhanceDashboard();
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    }
  }
  
  /**
   * Fetch statistics data
   */
  async fetchData() {
    const response = await fetch(this.dataUrl);
    if (!response.ok) {
      throw new Error(`Failed to load statistics: ${response.status}`);
    }
    return response.json();
  }
  
  /**
   * Enhance dashboard with interactive features
   */
  enhanceDashboard() {
    // Add refresh capability
    this.addRefreshButton();
    
    // Add data download options
    this.addDownloadOptions();
    
    // Log successful load
    console.log('Statistics dashboard enhanced with data:', this.data);
  }
  
  /**
   * Add a refresh button to update data
   */
  addRefreshButton() {
    // Placeholder for refresh functionality
    // In production, this would refresh data from an API
  }
  
  /**
   * Add download options for different formats
   */
  addDownloadOptions() {
    // Placeholder for generating CSV/Excel downloads
  }
  
  /**
   * Format number with thousands separator
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    return new Intl.NumberFormat('en-GB').format(num);
  }
  
  /**
   * Format currency value
   * @param {number} value - Value to format
   * @returns {string} Formatted currency
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  }
  
  /**
   * Format percentage
   * @param {number} value - Value to format
   * @returns {string} Formatted percentage
   */
  formatPercent(value) {
    return `${value}%`;
  }
}
