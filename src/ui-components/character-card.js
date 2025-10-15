import { LitElement, html, css } from 'lit';

export class CharacterCard extends LitElement {
  static properties = {
    character: { type: Object },
    showQuote: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
    }

    .character-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .character-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .character-image-container {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: linear-gradient(135deg, #6c757d, #495057);
    }

    .character-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .character-card:hover .character-image {
      transform: scale(1.05);
    }

    .character-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #6c757d, #495057);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 48px;
      font-weight: bold;
    }

    .character-info {
      padding: 20px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .character-name {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin: 0 0 10px 0;
      line-height: 1.2;
    }

    .character-quote {
      font-size: 14px;
      color: #666;
      font-style: italic;
      line-height: 1.4;
      margin: 0;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .character-quote::before {
      content: '"';
      color: #6c757d;
      font-weight: bold;
    }

    .character-quote::after {
      content: '"';
      color: #6c757d;
      font-weight: bold;
    }

    .character-actions {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .view-details-button {
      background: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .view-details-button:hover {
      background: #5a6268;
      transform: translateY(-1px);
    }

    .character-details {
      display: flex;
      gap: 8px;
      margin: 8px 0;
      flex-wrap: wrap;
    }

    .character-age {
      font-size: 12px;
      color: #6c757d;
      background: #f8f9fa;
      padding: 4px 8px;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .character-status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 500;
    }

    .character-status.alive {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .character-status.deceased {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .character-id {
      font-size: 11px;
      color: #999;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 10px;
    }

    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .skeleton-image {
      width: 100%;
      height: 200px;
    }

    .skeleton-text {
      height: 20px;
      margin: 10px 0;
      border-radius: 4px;
    }

    .skeleton-text.short {
      width: 60%;
    }

    .skeleton-text.long {
      width: 100%;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .character-info {
        padding: 15px;
      }
      
      .character-name {
        font-size: 18px;
      }
      
      .character-quote {
        font-size: 13px;
      }
    }
  `;

  constructor() {
    super();
    this.character = null;
    this.showQuote = true;
  }

  handleCardClick() {
    if (this.character && this.character.id) {
      this.dispatchEvent(new CustomEvent('character-selected', {
        detail: { character: this.character },
        bubbles: true
      }));
    }
  }

  handleDetailsClick(event) {
    event.stopPropagation();
    this.handleCardClick();
  }

  getCharacterImage() {
    if (this.character && this.character.portrait_path) {
      return this.character.portrait_path;
    }
    return null;
  }

  getCharacterName() {
    return this.character?.name || 'Personaje sin nombre';
  }

  getCharacterQuote() {
    if (!this.showQuote) return '';
    
    if (this.character?.phrases && this.character.phrases.length > 0) {
      return this.character.phrases[0];
    }
    
    return this.character?.occupation || 'No hay información disponible';
  }

  renderSkeleton() {
    return html`
      <div class="character-card">
        <div class="character-image-container">
          <div class="skeleton-image loading-skeleton"></div>
        </div>
        <div class="character-info">
          <div class="skeleton-text short loading-skeleton"></div>
          <div class="skeleton-text long loading-skeleton"></div>
          <div class="skeleton-text long loading-skeleton"></div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.character) {
      return this.renderSkeleton();
    }

    return html`
      <div class="character-card" @click="${this.handleCardClick}">
        <div class="character-image-container">
          ${this.getCharacterImage() ? html`
            <img 
              class="character-image" 
              src="${this.getCharacterImage()}" 
              alt="${this.getCharacterName()}"
              loading="lazy"
              @error="${(e) => e.target.style.display = 'none'}"
            />
          ` : html`
            <div class="character-placeholder">
              ${this.getCharacterName().charAt(0).toUpperCase()}
            </div>
          `}
        </div>
        
        <div class="character-info">
          <h3 class="character-name">${this.getCharacterName()}</h3>
          
          ${this.showQuote ? html`
            <p class="character-quote">${this.getCharacterQuote()}</p>
          ` : ''}
          
          <div class="character-details">
            ${this.character.age ? html`
              <span class="character-age">${this.character.age} años</span>
            ` : ''}
            ${this.character.status ? html`
              <span class="character-status ${this.character.status.toLowerCase()}">${this.character.status}</span>
            ` : ''}
          </div>
          
          <div class="character-actions">
            <button class="view-details-button" @click="${this.handleDetailsClick}">
              Ver Detalles
            </button>
            ${this.character.id ? html`
              <span class="character-id">ID: ${this.character.id}</span>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('character-card', CharacterCard);
