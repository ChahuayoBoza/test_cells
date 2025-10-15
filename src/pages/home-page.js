import { LitElement, html, css } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';
import '../ui-components/search-bar.js';
import '../ui-components/character-list.js';
import '../data-managers/simpsons-data-manager.js';
import '../data-managers/search-data-manager.js';


export class HomePage extends PageMixin(LitElement) {

  characters = [];
  filteredCharacters = [];
  loading = false;
  error = null;
  searchTerm = '';

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .home-page-container {
      min-height: 100vh;
      padding: 20px 0;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 0 20px;
    }

    .page-title {
      font-size: 48px;
      font-weight: bold;
      color: white;
      margin: 0 0 10px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .page-subtitle {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 30px 0;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .search-section {
      max-width: 600px;
      margin: 0 auto 40px auto;
      padding: 0 20px;
    }

    .content-section {
      width: 100%;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-title {
        font-size: 36px;
      }
      
      .page-subtitle {
        font-size: 18px;
      }
      
      .search-section {
        padding: 0 15px;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 28px;
      }
      
      .page-subtitle {
        font-size: 16px;
      }
    }
  `;

  constructor() {
    super();
    
    this.simpsonsDataManager = null;
    this.searchDataManager = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.subscribe('favorite-characters', (data) => {
    });
  }

  firstUpdated() {
    this.simpsonsDataManager = this.shadowRoot.querySelector('simpsons-data-manager');
    this.searchDataManager = this.shadowRoot.querySelector('search-data-manager');
    
    this.loadCharacters();
  }

  async loadCharacters() {
    if (this.simpsonsDataManager) {
      await this.simpsonsDataManager.fetchCharacters();
    }
  }

  handleCharactersLoaded(event) {
    this.characters = event.detail.characters;
    this.filteredCharacters = [...this.characters];
    this.loading = false;
    this.error = null;
    this.requestUpdate();
  }

  handleCharactersError(event) {
    this.error = event.detail.error;
    this.loading = false;
    this.requestUpdate();
  }

  handleLoadingStarted() {
    this.loading = true;
    this.error = null;
    this.requestUpdate();
  }
 
  handleSearchInputChanged(event) {
    this.searchTerm = event.detail.searchTerm;
    
    this.filterCharacters(this.searchTerm);
    
    if (this.searchDataManager) {
      this.searchDataManager.setSearchTerm(this.searchTerm);
    }
  }

  handleSearchRequested(event) {
    this.searchTerm = event.detail.searchTerm;
    this.filterCharacters(this.searchTerm);
  }

  
  handleSearchCompleted(event) {
   
  }

  
  handleSearchCleared() {
    this.searchTerm = '';
    this.filteredCharacters = [...this.characters];
    this.requestUpdate();
  }

  filterCharacters(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredCharacters = [...this.characters];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredCharacters = this.characters.filter(character => {
        if (character.name && character.name.toLowerCase().includes(term)) {
          return true;
        }
        if (character.quote && character.quote.toLowerCase().includes(term)) {
          return true;
        }
        if (character.description && character.description.toLowerCase().includes(term)) {
          return true;
        }
        return false;
      });
    }
    this.requestUpdate(); 
  }


  handleCharacterSelected(event) {
    const character = event.detail.character;
    console.log('Character selected:', character);
    console.log('Character ID:', character.id);
    
    console.log('Attempting to navigate to character-details with ID:', character.id);
    console.log('ID type:', typeof character.id);
    
    this.navigate('character-details', { id: character.id });
    console.log('Navigate called');
  }

  handleRetryRequested() {
    this.loadCharacters();
  }

  render() {
    return html`
      <div class="home-page-container">
        <!-- Data Managers (invisibles) -->
        <simpsons-data-manager
          @characters-loaded="${this.handleCharactersLoaded}"
          @characters-error="${this.handleCharactersError}"
        ></simpsons-data-manager>
        
        <search-data-manager
          @search-completed="${this.handleSearchCompleted}"
        ></search-data-manager>

        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Los Simpsons</h1>
          <p class="page-subtitle">Explora los personajes de Springfield</p>
        </div>

        <!-- Search Section -->
        <div class="search-section">
          <search-bar
            .searchTerm="${this.searchTerm}"
            .isSearching="${this.loading}"
            @search-input-changed="${this.handleSearchInputChanged}"
            @search-requested="${this.handleSearchRequested}"
            @search-cleared="${this.handleSearchCleared}"
          ></search-bar>
        </div>

        <!-- Content Section -->
        <div class="content-section">
          <character-list
            .characters="${this.filteredCharacters}"
            .loading="${this.loading}"
            .error="${this.error}"
            .searchTerm="${this.searchTerm}"
            @character-selected="${this.handleCharacterSelected}"
            @retry-requested="${this.handleRetryRequested}"
          ></character-list>
        </div>
      </div>
    `;
  }
}

customElements.define('home-page', HomePage);
