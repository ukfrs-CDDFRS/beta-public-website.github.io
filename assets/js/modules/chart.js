/**
 * Chart Module
 * Placeholder for chart rendering
 * Ready for integration with Chart.js or similar
 */

export class Chart {
  constructor(element) {
    this.element = element;
    this.type = element.dataset.chartType || 'bar';
    this.dataUrl = element.dataset.chartUrl;
    this.loadingElement = element.querySelector('.app-chart__loading');
    
    this.init();
  }
  
  async init() {
    if (this.dataUrl) {
      try {
        const data = await this.fetchData();
        this.render(data);
      } catch (error) {
        this.showError(error);
      }
    } else {
      this.showPlaceholder();
    }
  }
  
  /**
   * Fetch chart data from URL
   */
  async fetchData() {
    const response = await fetch(this.dataUrl);
    if (!response.ok) {
      throw new Error(`Failed to load chart data: ${response.status}`);
    }
    return response.json();
  }
  
  /**
   * Render chart
   * This is a placeholder - integrate Chart.js or similar here
   * @param {Object} data - Chart data
   */
  render(data) {
    // Hide loading
    if (this.loadingElement) {
      this.loadingElement.hidden = true;
    }
    
    // Placeholder rendering
    // In production, use Chart.js, D3, or similar
    const chartContainer = document.createElement('div');
    chartContainer.className = 'app-chart__placeholder-content';
    chartContainer.innerHTML = `
      <div style="padding: 2rem; text-align: center; background: #f3f2f1;">
        <p><strong>Chart Placeholder</strong></p>
        <p>Type: ${this.type}</p>
        <p>Data loaded successfully</p>
        <p><small>Integrate Chart.js or D3 for actual chart rendering</small></p>
      </div>
    `;
    
    this.element.appendChild(chartContainer);
    
    // Log data for development
    console.log('Chart data loaded:', data);
  }
  
  /**
   * Show placeholder when no data URL
   */
  showPlaceholder() {
    if (this.loadingElement) {
      this.loadingElement.innerHTML = `
        <p class="govuk-body">Chart placeholder - no data URL provided</p>
      `;
    }
  }
  
  /**
   * Show error message
   * @param {Error} error - Error object
   */
  showError(error) {
    console.error('Chart error:', error);
    
    if (this.loadingElement) {
      this.loadingElement.innerHTML = `
        <p class="govuk-body govuk-error-message">
          Unable to load chart data. Please try refreshing the page.
        </p>
      `;
    }
  }
}
