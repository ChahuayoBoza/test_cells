import { LitElement, html, css } from 'lit';
import './character-card.js';

export class CharacterList extends LitElement {
  static properties = {
    characters: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    searchTerm: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .character-list-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .list-header {
      margin-bottom: 30px;
      text-align: center;
    }

    .list-title {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin: 0 0 10px 0;
    }

    .list-subtitle {
      font-size: 16px;
      color: #666;
      margin: 0;
    }

    .search-results-info {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
      text-align: center;
    }

    .search-results-text {
      color: #495057;
      font-size: 14px;
      margin: 0;
    }

    .search-results-count {
      font-weight: bold;
      color: #ff6b35;
    }

    .characters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
      margin-bottom: 30px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #ff6b35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      margin-left: 15px;
      color: #666;
      font-size: 16px;
    }

    .error-container {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }

    .error-icon {
      font-size: 48px;
      color: #dc3545;
      margin-bottom: 15px;
    }

    .error-title {
      font-size: 18px;
      font-weight: bold;
      color: #721c24;
      margin: 0 0 10px 0;
    }

    .error-message {
      color: #721c24;
      margin: 0 0 15px 0;
    }

    .retry-button {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }

    .retry-button:hover {
      background: #5a6268;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state-icon {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-state-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin: 0 0 10px 0;
    }

    .empty-state-message {
      font-size: 16px;
      color: #666;
      margin: 0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 30px;
    }

    .pagination-button {
      background: #ff6b35;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .pagination-button:hover:not(:disabled) {
      background: #e55a2b;
      transform: translateY(-1px);
    }

    .pagination-button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .pagination-info {
      color: #666;
      font-size: 14px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .character-list-container {
        padding: 15px;
      }
      
      .characters-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .list-title {
        font-size: 24px;
      }
      
      .pagination {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 480px) {
      .character-list-container {
        padding: 10px;
      }
      
      .characters-grid {
        gap: 15px;
      }
    }
  `;

  constructor() {
    super();
    this.characters = [];
    this.loading = false;
    this.error = null;
    this.searchTerm = '';
  }

  handleCharacterSelected(event) {
    this.dispatchEvent(new CustomEvent('character-selected', {
      detail: event.detail,
      bubbles: true
    }));
  }

  handleRetry() {
    this.dispatchEvent(new CustomEvent('retry-requested', {
      bubbles: true
    }));
  }

  renderLoading() {
    return html`
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Cargando personajes...</div>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Error al cargar los personajes</h3>
        <p class="error-message">${this.error}</p>
        <button class="retry-button" @click="${this.handleRetry}">
          Reintentar
        </button>
      </div>
    `;
  }

  renderEmptyState() {
    if (this.searchTerm) {
      return html`
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">No se encontraron personajes</h3>
          <p class="empty-state-message">
            No hay personajes que coincidan con "${this.searchTerm}". 
            Intenta con otro término de búsqueda.
          </p>
        </div>
      `;
    }

    return html`
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <h3 class="empty-state-title">No hay personajes disponibles</h3>
        <p class="empty-state-message">
          No se pudieron cargar los personajes. Intenta recargar la página.
        </p>
      </div>
    `;
  }

  renderSearchResultsInfo() {
    if (!this.searchTerm) return '';

    const count = this.characters.length;
    const text = count === 1 ? 'personaje encontrado' : 'personajes encontrados';

    return html`
      <div class="search-results-info">
        <p class="search-results-text">
          <span class="search-results-count">${count}</span> ${text} para "${this.searchTerm}"
        </p>
      </div>
    `;
  }

  renderCharactersGrid() {
    return html`
      <div class="characters-grid">
        ${this.characters.map(character => html`
          <character-card 
            .character="${character}"
            @character-selected="${this.handleCharacterSelected}"
          ></character-card>
        `)}
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="character-list-container">
          <div class="list-header">
            <h1 class="list-title">Los Simpsons</h1>
            <p class="list-subtitle">Cargando personajes...</p>
          </div>
          ${this.renderLoading()}
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="character-list-container">
          <div class="list-header">
            <h1 class="list-title">Los Simpsons</h1>
            <p class="list-subtitle">Error al cargar los datos</p>
          </div>
          ${this.renderError()}
        </div>
      `;
    }

    if (!this.characters || this.characters.length === 0) {
      return html`
        <div class="character-list-container">
          <div class="list-header">
            <h1 class="list-title">Los Simpsons</h1>
            <p class="list-subtitle">Explora los personajes de Springfield</p>
          </div>
          ${this.renderEmptyState()}
        </div>
      `;
    }

    return html`
      <div class="character-list-container">
        <div class="list-header">
          <h1 class="list-title">Los Simpsons</h1>
          <p class="list-subtitle">Explora los personajes de Springfield</p>
        </div>
        
        ${this.renderSearchResultsInfo()}
        ${this.renderCharactersGrid()}
      </div>
    `;
  }
}

customElements.define('character-list', CharacterList);
