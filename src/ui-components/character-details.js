import { LitElement, html, css } from 'lit';

export class CharacterDetails extends LitElement {
  static properties = {
    character: { type: Object },
    loading: { type: Boolean },
    error: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .character-details-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .back-button {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 30px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .back-button:hover {
      background: #5a6268;
      transform: translateY(-1px);
    }

    .back-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .character-details-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }

    .character-image-section {
      position: relative;
      background: linear-gradient(135deg, #6c757d, #495057);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .character-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .character-placeholder {
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 80px;
      font-weight: bold;
    }

    .character-info-section {
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .character-name {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      margin: 0 0 20px 0;
      line-height: 1.2;
    }

    .character-id {
      background: #f8f9fa;
      color: #6c757d;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 20px;
    }

    .character-description {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin: 0 0 30px 0;
    }

    .character-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-label {
      font-weight: 600;
      color: #495057;
      font-size: 14px;
    }

    .info-value {
      color: #6c757d;
      font-size: 16px;
    }

    .info-value.status-alive {
      color: #155724;
      font-weight: 500;
    }

    .info-value.status-deceased {
      color: #721c24;
      font-weight: 500;
    }

    .phrases-section {
      margin: 30px 0;
    }

    .phrases-title {
      color: #495057;
      margin: 0 0 15px 0;
      font-size: 18px;
    }

    .phrases-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .phrase-item {
      background: #f8f9fa;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #6c757d;
      font-style: italic;
      color: #495057;
    }

    .character-quote {
      background: #f8f9fa;
      border-left: 4px solid #6c757d;
      padding: 20px;
      border-radius: 0 10px 10px 0;
      margin: 0 0 30px 0;
      font-style: italic;
      font-size: 16px;
      color: #333;
      line-height: 1.5;
    }

    .character-quote::before {
      content: '"';
      color: #6c757d;
      font-weight: bold;
      font-size: 24px;
    }

    .character-quote::after {
      content: '"';
      color: #6c757d;
      font-weight: bold;
      font-size: 24px;
    }

    .character-actions {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-button {
      background: #6c757d;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .action-button:hover {
      background: #e55a2b;
      transform: translateY(-2px);
    }

    .action-button.secondary {
      background: #6c757d;
    }

    .action-button.secondary:hover {
      background: #5a6268;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #6c757d;
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
      border-radius: 15px;
      padding: 30px;
      text-align: center;
    }

    .error-icon {
      font-size: 48px;
      color: #dc3545;
      margin-bottom: 15px;
    }

    .error-title {
      font-size: 20px;
      font-weight: bold;
      color: #721c24;
      margin: 0 0 10px 0;
    }

    .error-message {
      color: #721c24;
      margin: 0 0 20px 0;
    }

    .retry-button {
      background: #dc3545;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }

    .retry-button:hover {
      background: #c82333;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .character-details-container {
        padding: 15px;
      }
      
      .character-details-card {
        grid-template-columns: 1fr;
      }
      
      .character-info-section {
        padding: 30px 20px;
      }
      
      .character-name {
        font-size: 28px;
      }
      
      .character-actions {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .character-details-container {
        padding: 10px;
      }
      
      .character-info-section {
        padding: 20px 15px;
      }
      
      .character-name {
        font-size: 24px;
      }
      
      .character-actions {
        flex-direction: column;
      }
      
      .action-button {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.character = null;
    this.loading = false;
    this.error = null;
  }

  handleBackClick() {
    this.dispatchEvent(new CustomEvent('back-requested', {
      bubbles: true
    }));
  }

  handleShareClick() {
    if (navigator.share && this.character) {
      navigator.share({
        title: `${this.character.name} - Los Simpsons`,
        text: `Mira los detalles de ${this.character.name} de Los Simpsons`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  handleFavoriteClick() {
    this.dispatchEvent(new CustomEvent('favorite-toggled', {
      detail: { character: this.character },
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
        <div class="loading-text">Cargando detalles...</div>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Error al cargar los detalles</h3>
        <p class="error-message">${this.error}</p>
        <button class="retry-button" @click="${this.handleRetry}">
          Reintentar
        </button>
      </div>
    `;
  }

  renderCharacterDetails() {
    if (!this.character) return '';

    return html`
      <button class="back-button" @click="${this.handleBackClick}">
        <svg class="back-icon" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Volver a la lista
      </button>

      <div class="character-details-card">
        <div class="character-image-section">
          ${this.character.portrait_path ? html`
            <img 
              class="character-image" 
              src="https://thesimpsonsapi.com${this.character.portrait_path}" 
              alt="${this.character.name}"
              loading="lazy"
              @error="${(e) => e.target.style.display = 'none'}"
            />
          ` : html`
            <div class="character-placeholder">
              ${this.character.name ? this.character.name.charAt(0).toUpperCase() : '?'}
            </div>
          `}
        </div>
        
        <div class="character-info-section">
          <h1 class="character-name">${this.character.name || 'Personaje sin nombre'}</h1>
          
          ${this.character.id ? html`
            <span class="character-id">ID: ${this.character.id}</span>
          ` : ''}
          
          <div class="character-info-grid">
            ${this.character.age ? html`
              <div class="info-item">
                <span class="info-label">Edad:</span>
                <span class="info-value">${this.character.age} años</span>
              </div>
            ` : ''}
            
            ${this.character.gender ? html`
              <div class="info-item">
                <span class="info-label">Género:</span>
                <span class="info-value">${this.character.gender}</span>
              </div>
            ` : ''}
            
            ${this.character.occupation ? html`
              <div class="info-item">
                <span class="info-label">Ocupación:</span>
                <span class="info-value">${this.character.occupation}</span>
              </div>
            ` : ''}
            
            ${this.character.status ? html`
              <div class="info-item">
                <span class="info-label">Estado:</span>
                <span class="info-value status-${this.character.status.toLowerCase()}">${this.character.status}</span>
              </div>
            ` : ''}
            
            ${this.character.birthdate ? html`
              <div class="info-item">
                <span class="info-label">Fecha de nacimiento:</span>
                <span class="info-value">${this.character.birthdate}</span>
              </div>
            ` : ''}
          </div>
          
          ${this.character.phrases && this.character.phrases.length > 0 ? html`
            <div class="phrases-section">
              <h3 class="phrases-title">Frases famosas:</h3>
              <div class="phrases-list">
                ${this.character.phrases.slice(0, 5).map(phrase => html`
                  <div class="phrase-item">"${phrase}"</div>
                `)}
              </div>
            </div>
          ` : ''}
          
          <div class="character-actions">
            <button class="action-button" @click="${this.handleFavoriteClick}">
              ⭐ Favorito
            </button>
            <button class="action-button secondary" @click="${this.handleShareClick}">
              📤 Compartir
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="character-details-container">
          ${this.renderLoading()}
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="character-details-container">
          ${this.renderError()}
        </div>
      `;
    }

    return html`
      <div class="character-details-container">
        ${this.renderCharacterDetails()}
      </div>
    `;
  }
}

customElements.define('character-details', CharacterDetails);
