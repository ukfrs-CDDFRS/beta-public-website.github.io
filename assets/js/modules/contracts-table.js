/**
 * Contracts Table Module
 * Loads and filters contracts data from CSV
 */

export class ContractsTable {
  constructor(element) {
    this.element = element;
    this.dataUrl = element.dataset.contractsUrl;
    this.table = element.querySelector('table');
    this.tbody = this.table?.querySelector('tbody');
    this.countElement = document.getElementById('contracts-count');
    this.filters = document.querySelectorAll('[data-filter]');
    this.originalData = [];
    
    this.init();
  }
  
  async init() {
    // Bind filter events
    this.filters.forEach(filter => {
      filter.addEventListener('change', () => this.applyFilters());
    });
    
    // Data is already rendered server-side via Eleventy
    // This module adds client-side filtering
    this.parseExistingData();
  }
  
  /**
   * Parse data from existing table rows
   */
  parseExistingData() {
    if (!this.tbody) return;
    
    const rows = this.tbody.querySelectorAll('tr');
    this.originalData = Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td, th');
      return {
        element: row,
        reference: cells[0]?.textContent.trim() || '',
        title: cells[1]?.textContent.trim() || '',
        supplier: cells[2]?.textContent.trim() || '',
        value: cells[3]?.textContent.trim() || '',
        published: cells[4]?.textContent.trim() || '',
        status: cells[5]?.textContent.trim() || '',
        // Additional data attributes for filtering
        department: row.dataset.department || this.inferDepartment(cells),
        category: row.dataset.category || this.inferCategory(cells)
      };
    });
  }
  
  /**
   * Infer department from reference or other data
   * In a real implementation, this would come from data attributes
   */
  inferDepartment(cells) {
    // Placeholder - actual data would have department
    return '';
  }
  
  /**
   * Infer category from reference or other data
   */
  inferCategory(cells) {
    // Placeholder - actual data would have category
    return '';
  }
  
  /**
   * Apply current filter selections
   */
  applyFilters() {
    const activeFilters = {};
    
    this.filters.forEach(filter => {
      const key = filter.dataset.filter;
      const value = filter.value;
      if (value) {
        activeFilters[key] = value.toLowerCase();
      }
    });
    
    let visibleCount = 0;
    
    this.originalData.forEach(item => {
      let visible = true;
      
      // Check each active filter
      Object.entries(activeFilters).forEach(([key, value]) => {
        const itemValue = (item[key] || '').toLowerCase();
        if (!itemValue.includes(value)) {
          visible = false;
        }
      });
      
      item.element.hidden = !visible;
      if (visible) visibleCount++;
    });
    
    // Update count
    this.updateCount(visibleCount);
    
    // Announce for screen readers
    this.announce(`Showing ${visibleCount} contracts`);
  }
  
  /**
   * Update the visible count display
   * @param {number} count - Number of visible items
   */
  updateCount(count) {
    if (this.countElement) {
      this.countElement.innerHTML = `Showing <strong>${count}</strong> contract${count !== 1 ? 's' : ''}`;
    }
  }
  
  /**
   * Announce message for screen readers
   * @param {string} message - Message to announce
   */
  announce(message) {
    // Create or reuse announcer element
    let announcer = document.getElementById('contracts-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'contracts-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.classList.add('govuk-visually-hidden');
      this.element.appendChild(announcer);
    }
    
    announcer.textContent = message;
  }
}
