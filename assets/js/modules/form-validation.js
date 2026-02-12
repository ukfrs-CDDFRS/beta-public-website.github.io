/**
 * Form Validation Module
 * Client-side validation following GOV.UK patterns
 */

export class FormValidation {
  constructor(element) {
    this.form = element;
    this.errorSummary = null;
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add blur validation for immediate feedback
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  }
  
  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  handleSubmit(e) {
    const errors = this.validateForm();
    
    if (errors.length > 0) {
      e.preventDefault();
      this.showErrorSummary(errors);
      this.errorSummary?.focus();
    }
  }
  
  /**
   * Validate entire form
   * @returns {Array} Array of error objects
   */
  validateForm() {
    const errors = [];
    const requiredFields = this.form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      const error = this.validateField(field);
      if (error) {
        errors.push(error);
      }
    });
    
    return errors;
  }
  
  /**
   * Validate a single field
   * @param {HTMLElement} field - Form field
   * @returns {Object|null} Error object or null
   */
  validateField(field) {
    const value = field.value.trim();
    const label = this.getFieldLabel(field);
    let error = null;
    
    // Clear existing error
    this.clearFieldError(field);
    
    // Required validation
    if (field.required && !value) {
      error = {
        field: field,
        id: field.id,
        message: `Enter ${label.toLowerCase()}`
      };
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = {
          field: field,
          id: field.id,
          message: `Enter a valid email address`
        };
      }
    }
    
    // Show error if present
    if (error) {
      this.showFieldError(field, error.message);
    }
    
    return error;
  }
  
  /**
   * Get label text for a field
   * @param {HTMLElement} field - Form field
   * @returns {string} Label text
   */
  getFieldLabel(field) {
    const label = this.form.querySelector(`label[for="${field.id}"]`);
    return label?.textContent.trim() || field.name || 'this field';
  }
  
  /**
   * Show error on a field
   * @param {HTMLElement} field - Form field
   * @param {string} message - Error message
   */
  showFieldError(field, message) {
    const formGroup = field.closest('.govuk-form-group');
    if (!formGroup) return;
    
    // Add error class
    formGroup.classList.add('govuk-form-group--error');
    field.classList.add('govuk-input--error');
    
    // Create error message
    const errorSpan = document.createElement('p');
    errorSpan.id = `${field.id}-error`;
    errorSpan.className = 'govuk-error-message';
    errorSpan.innerHTML = `<span class="govuk-visually-hidden">Error:</span> ${message}`;
    
    // Insert before input
    field.parentNode.insertBefore(errorSpan, field);
    
    // Update aria-describedby
    const existingDescribedBy = field.getAttribute('aria-describedby') || '';
    field.setAttribute('aria-describedby', `${field.id}-error ${existingDescribedBy}`.trim());
  }
  
  /**
   * Clear error from a field
   * @param {HTMLElement} field - Form field
   */
  clearFieldError(field) {
    const formGroup = field.closest('.govuk-form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('govuk-form-group--error');
    field.classList.remove('govuk-input--error');
    
    // Remove error message
    const errorSpan = formGroup.querySelector(`#${field.id}-error`);
    errorSpan?.remove();
    
    // Update aria-describedby
    const describedBy = field.getAttribute('aria-describedby') || '';
    field.setAttribute('aria-describedby', describedBy.replace(`${field.id}-error`, '').trim());
  }
  
  /**
   * Show error summary at top of form
   * @param {Array} errors - Array of error objects
   */
  showErrorSummary(errors) {
    // Remove existing summary
    this.errorSummary?.remove();
    
    // Create error summary
    this.errorSummary = document.createElement('div');
    this.errorSummary.className = 'govuk-error-summary';
    this.errorSummary.setAttribute('aria-labelledby', 'error-summary-title');
    this.errorSummary.setAttribute('role', 'alert');
    this.errorSummary.setAttribute('tabindex', '-1');
    
    const errorList = errors.map(error => 
      `<li><a href="#${error.id}">${error.message}</a></li>`
    ).join('');
    
    this.errorSummary.innerHTML = `
      <div role="alert">
        <h2 class="govuk-error-summary__title" id="error-summary-title">
          There is a problem
        </h2>
        <div class="govuk-error-summary__body">
          <ul class="govuk-list govuk-error-summary__list">
            ${errorList}
          </ul>
        </div>
      </div>
    `;
    
    // Insert at top of form
    this.form.insertBefore(this.errorSummary, this.form.firstChild);
  }
}
