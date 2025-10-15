import { LitElement, html, css } from 'lit';

export class SearchBar extends LitElement {
  static properties = {
    searchTerm: { type: String },
    isSearching: { type: Boolean },
    suggestions: { type: Array },
    placeholder: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    .search-container {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      padding-right: 50px;
      border: 2px solid #e0e0e0;
      border-radius: 25px;
      font-size: 16px;
      outline: none;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .search-input:focus {
      border-color: #6c757d;
      box-shadow: 0 4px 20px rgba(108, 117, 125, 0.2);
    }

    .search-input::placeholder {
      color: #999;
    }

    .search-button {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: #6c757d;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .search-button:hover {
      background: #5a6268;
      transform: translateY(-50%) scale(1.05);
    }

    .search-button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: translateY(-50%);
    }

    .search-icon {
      width: 18px;
      height: 18px;
      fill: white;
    }

    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid #ffffff;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 15px 15px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .suggestion-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s ease;
    }

    .suggestion-item:hover {
      background-color: #f8f8f8;
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }

    .suggestion-text {
      color: #333;
      font-size: 14px;
    }

    .suggestion-highlight {
      background-color: #e9ecef;
      padding: 2px 4px;
      border-radius: 3px;
    }

    .clear-button {
      position: absolute;
      right: 50px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      font-size: 18px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .clear-button:hover {
      background: #f0f0f0;
      color: #666;
    }
  `;

  constructor() {
    super();
    this.searchTerm = '';
    this.isSearching = false;
    this.suggestions = [];
    this.placeholder = 'Buscar personajes de Los Simpsons...';
  }

  handleInputChange(event) {
    const value = event.target.value;
    this.searchTerm = value;
    
    this.dispatchEvent(new CustomEvent('search-input-changed', {
      detail: { searchTerm: value },
      bubbles: true
    }));
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    this.performSearch();
  }

  performSearch() {
    if (this.searchTerm.trim()) {
      this.dispatchEvent(new CustomEvent('search-requested', {
        detail: { searchTerm: this.searchTerm },
        bubbles: true
      }));
    }
  }
  
  handleSuggestionClick(suggestion) {
    this.searchTerm = suggestion;
    this.suggestions = [];
    
    this.dispatchEvent(new CustomEvent('search-input-changed', {
      detail: { searchTerm: suggestion },
      bubbles: true
    }));
    
    this.performSearch();
  }

  clearSearch() {
    this.searchTerm = '';
    this.suggestions = [];
    
    this.dispatchEvent(new CustomEvent('search-cleared', {
      bubbles: true
    }));
  }

  highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
  }

  render() {
    return html`
      <div class="search-container">
        <form @submit="${this.handleSearchSubmit}">
          <input
            type="text"
            class="search-input"
            .value="${this.searchTerm}"
            .placeholder="${this.placeholder}"
            @input="${this.handleInputChange}"
            autocomplete="off"
          />
          
          ${this.searchTerm ? html`
            <button 
              type="button" 
              class="clear-button"
              @click="${this.clearSearch}"
              title="Limpiar búsqueda"
            >
              ×
            </button>
          ` : ''}
          
          <button 
            type="submit" 
            class="search-button"
            ?disabled="${this.isSearching}"
            title="Buscar"
          >
            ${this.isSearching ? html`
              <div class="loading-spinner"></div>
            ` : html`
              <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            `}
          </button>
        </form>
        
        ${this.suggestions.length > 0 ? html`
          <div class="suggestions">
            ${this.suggestions.map(suggestion => html`
              <div 
                class="suggestion-item"
                @click="${() => this.handleSuggestionClick(suggestion)}"
              >
                <span class="suggestion-text" .innerHTML="${this.highlightSearchTerm(suggestion, this.searchTerm)}"></span>
              </div>
            `)}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);
