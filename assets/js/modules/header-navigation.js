/**
 * Header Navigation Module
 * Handles Menu and Search toggle buttons - GOV.UK style
 * Both push the page content down when expanded
 */

export class HeaderNavigation {
  /**
   * @param {HTMLElement} element - The header element
   */
  constructor(element) {
    this.header = element;
    this.menuButton = this.header.querySelector('.js-header-toggle');
    this.navigationWrapper = this.header.querySelector('#header-navigation');
    this.searchButton = this.header.querySelector('.js-search-toggle');
    this.searchWrapper = this.header.querySelector('#header-search');
    this.searchInput = this.header.querySelector('#header-search-input');
    
    this.isMenuOpen = false;
    this.isSearchOpen = false;
    
    this.init();
  }
  
  /**
   * Initialise the header navigation
   */
  init() {
    // Menu toggle setup
    if (this.menuButton && this.navigationWrapper) {
      this.menuButton.setAttribute('aria-expanded', 'false');
      
      this.menuButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }
    
    // Search toggle setup
    if (this.searchButton && this.searchWrapper) {
      this.searchButton.setAttribute('aria-expanded', 'false');
      
      this.searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSearch();
      });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.isSearchOpen) {
          this.closeSearch();
          this.searchButton.focus();
        } else if (this.isMenuOpen) {
          this.closeMenu();
          this.menuButton.focus();
        }
      }
    });
    
    // Close when clicking outside header
    document.addEventListener('click', (event) => {
      if (!this.header.contains(event.target)) {
        if (this.isMenuOpen) {
          this.closeMenu();
        }
        if (this.isSearchOpen) {
          this.closeSearch();
        }
      }
    });
  }
  
  /**
   * Toggle the menu
   */
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  /**
   * Open the menu
   */
  openMenu() {
    // Close search if open
    if (this.isSearchOpen) {
      this.closeSearch();
    }
    
    this.isMenuOpen = true;
    this.navigationWrapper.removeAttribute('hidden');
    this.menuButton.setAttribute('aria-expanded', 'true');
    
    // Focus first link
    const firstLink = this.navigationWrapper.querySelector('a');
    if (firstLink) {
      firstLink.focus();
    }
  }
  
  /**
   * Close the menu
   */
  closeMenu() {
    this.isMenuOpen = false;
    if (this.navigationWrapper) {
      this.navigationWrapper.setAttribute('hidden', '');
    }
    if (this.menuButton) {
      this.menuButton.setAttribute('aria-expanded', 'false');
    }
  }
  
  /**
   * Toggle the search box
   */
  toggleSearch() {
    if (this.isSearchOpen) {
      this.closeSearch();
    } else {
      this.openSearch();
    }
  }
  
  /**
   * Open the search box
   */
  openSearch() {
    // Close menu if open
    if (this.isMenuOpen) {
      this.closeMenu();
    }
    
    this.isSearchOpen = true;
    this.searchButton.setAttribute('aria-expanded', 'true');
    this.searchWrapper.removeAttribute('hidden');
    
    // Focus search input
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }
  
  /**
   * Close the search box
   */
  closeSearch() {
    this.isSearchOpen = false;
    if (this.searchButton) {
      this.searchButton.setAttribute('aria-expanded', 'false');
    }
    if (this.searchWrapper) {
      this.searchWrapper.setAttribute('hidden', '');
    }
  }
}
