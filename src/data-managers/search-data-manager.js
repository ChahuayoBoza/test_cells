import { LitElement, html } from 'lit';

export class SearchDataManager extends LitElement {
  static properties = {
    searchTerm: { type: String },
    searchHistory: { type: Array },
    isSearching: { type: Boolean }
  };

  constructor() {
    super();
    this.searchTerm = '';
    this.searchHistory = [];
    this.isSearching = false;
    this.searchTimeout = null;
  }


  setSearchTerm(term) {
    this.searchTerm = term;
    this.isSearching = true;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.executeSearch(term);
    }, 300);

    this.dispatchEvent(new CustomEvent('search-started', {
      detail: { searchTerm: term },
      bubbles: true
    }));
  }

  executeSearch(term) {
    if (term && term.trim() !== '' && !this.searchHistory.includes(term)) {
      this.searchHistory.unshift(term);
      this.searchHistory = this.searchHistory.slice(0, 10);
    }

    this.isSearching = false;

    this.dispatchEvent(new CustomEvent('search-completed', {
      detail: { 
        searchTerm: term,
        searchHistory: this.searchHistory
      },
      bubbles: true
    }));
  }

  clearSearch() {
    this.searchTerm = '';
    this.isSearching = false;
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    this.dispatchEvent(new CustomEvent('search-cleared', {
      bubbles: true
    }));
  }

  getSuggestions(partialTerm) {
    if (!partialTerm || partialTerm.trim() === '') {
      return this.searchHistory.slice(0, 5); 
    }

    return this.searchHistory.filter(term => 
      term.toLowerCase().includes(partialTerm.toLowerCase())
    ).slice(0, 5);
  }

  filterCharacters(characters, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return characters;
    }

    const term = searchTerm.toLowerCase();
    return characters.filter(character => {
      if (character.name && character.name.toLowerCase().includes(term)) {
        return true;
      }
      
      if (character.description && character.description.toLowerCase().includes(term)) {
        return true;
      }
      
      if (character.quote && character.quote.toLowerCase().includes(term)) {
        return true;
      }
      
      return false;
    });
  }
 
  getSearchStats() {
    return {
      totalSearches: this.searchHistory.length,
      lastSearch: this.searchHistory[0] || null,
      isSearching: this.isSearching
    };
  }

  render() {
    return html``;
  }
}

customElements.define('search-data-manager', SearchDataManager);
