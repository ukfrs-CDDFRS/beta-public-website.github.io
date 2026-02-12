/**
 * Data Table Module
 * Enhances tables with sorting and filtering
 */

export class DataTable {
  constructor(element) {
    this.element = element;
    this.table = element.querySelector('table');
    this.headers = this.table?.querySelectorAll('th');
    this.tbody = this.table?.querySelector('tbody');
    
    if (this.table) {
      this.init();
    }
  }
  
  init() {
    this.makeSortable();
    this.announceElement = this.createAnnouncer();
  }
  
  /**
   * Create a live region for accessibility announcements
   */
  createAnnouncer() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('govuk-visually-hidden');
    this.element.appendChild(announcer);
    return announcer;
  }
  
  /**
   * Make table headers sortable
   */
  makeSortable() {
    this.headers?.forEach((header, index) => {
      // Skip if header has no text content
      if (!header.textContent.trim()) return;
      
      // Add sortable attributes
      header.setAttribute('aria-sort', 'none');
      header.setAttribute('tabindex', '0');
      header.style.cursor = 'pointer';
      
      // Click handler
      header.addEventListener('click', () => this.sortByColumn(index));
      
      // Keyboard handler
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.sortByColumn(index);
        }
      });
    });
    
    // Add class for CSS styling
    this.table.classList.add('app-table--sortable');
  }
  
  /**
   * Sort table by column
   * @param {number} columnIndex - Column index to sort by
   */
  sortByColumn(columnIndex) {
    const header = this.headers[columnIndex];
    const currentSort = header.getAttribute('aria-sort');
    const isNumeric = header.classList.contains('govuk-table__header--numeric');
    
    // Determine new sort direction
    const newSort = currentSort === 'ascending' ? 'descending' : 'ascending';
    
    // Reset all headers
    this.headers.forEach(h => h.setAttribute('aria-sort', 'none'));
    
    // Set new sort direction
    header.setAttribute('aria-sort', newSort);
    
    // Get rows and sort
    const rows = Array.from(this.tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
      const aCell = a.cells[columnIndex];
      const bCell = b.cells[columnIndex];
      
      let aValue = aCell?.textContent.trim() || '';
      let bValue = bCell?.textContent.trim() || '';
      
      // Handle numeric values
      if (isNumeric) {
        aValue = parseFloat(aValue.replace(/[^0-9.-]/g, '')) || 0;
        bValue = parseFloat(bValue.replace(/[^0-9.-]/g, '')) || 0;
        return newSort === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison
      const comparison = aValue.localeCompare(bValue, 'en', { sensitivity: 'base' });
      return newSort === 'ascending' ? comparison : -comparison;
    });
    
    // Reorder rows
    rows.forEach(row => this.tbody.appendChild(row));
    
    // Announce for screen readers
    const headerText = header.textContent.trim();
    this.announce(`Table sorted by ${headerText}, ${newSort} order`);
  }
  
  /**
   * Announce message for screen readers
   * @param {string} message - Message to announce
   */
  announce(message) {
    if (this.announceElement) {
      this.announceElement.textContent = message;
    }
  }
}
