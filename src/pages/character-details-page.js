import { LitElement, html, css } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';
import '../ui-components/character-details.js';
import '../data-managers/simpsons-data-manager.js';


export class CharacterDetailsPage extends PageMixin(LitElement) {
  static properties = {
    character: { type: Object },
    characterId: { type: String },
    loading: { type: Boolean },
    error: { type: String },
    params: { type: Object }
  };

  constructor() {
    super();
    this.character = null;
    this.characterId = null;
    this.loading = false;
    this.error = null;
    this.params = {};
    this.simpsonsDataManager = null;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .details-page-container {
      min-height: 100vh;
      padding: 20px 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .details-page-container {
        padding: 15px 0;
      }
    }

    @media (max-width: 480px) {
      .details-page-container {
        padding: 10px 0;
      }
    }
  `;


  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    // Buscar el data manager global
    this.simpsonsDataManager = document.querySelector('simpsons-data-manager');
    
    if (this.simpsonsDataManager) {
      this.simpsonsDataManager.addEventListener('character-details-loaded', this.handleCharacterDetailsLoaded.bind(this));
      this.simpsonsDataManager.addEventListener('character-details-error', this.handleCharacterDetailsError.bind(this));
    }
    
    if (this.params && this.params.id) {
      this.characterId = this.params.id;
      console.log('Character ID from params (firstUpdated):', this.characterId);
      this.loadCharacterDetails();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('params') && this.params && this.params.id) {
      this.characterId = this.params.id;
      console.log('Character ID from params:', this.characterId);
      this.loadCharacterDetails();
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('params') && this.params && this.params.id) {
      this.characterId = this.params.id;
      console.log('Character ID from params (willUpdate):', this.characterId);
      this.loadCharacterDetails();
    }
  }

  async loadCharacterDetails() {
    console.log('Loading character details for ID:', this.characterId);
    
    if (!this.characterId) {
      console.log('No character ID available');
      return;
    }

    const dataManager = document.querySelector('simpsons-data-manager');
    if (!dataManager) {
      console.log('No data manager found');
      this.error = 'No se pudo encontrar el gestor de datos';
      this.loading = false;
      this.requestUpdate();
      return;
    }

    this.loading = true;
    this.error = null;
    this.requestUpdate();

    try {
      const character = dataManager.characters.find(char => char.id == this.characterId);
      
      if (!character) {
        throw new Error(`Personaje con ID ${this.characterId} no encontrado`);
      }

      this.character = {
        ...character,
        portrait_path: dataManager.getCharacterImageUrl(character)
      };
      
      this.loading = false;
      this.error = null;
      console.log('Character loaded:', this.character);
      this.requestUpdate();
      
    } catch (error) {
      this.error = error.message;
      this.loading = false;
      console.log('Error loading character:', error);
      this.requestUpdate();
    }
  }

  handleCharacterDetailsLoaded(event) {
    this.character = event.detail.character;
    this.loading = false;
    this.error = null;
    this.requestUpdate();
  }

  handleCharacterDetailsError(event) {
    this.error = event.detail.error;
    this.loading = false;
    this.requestUpdate();
  }

  handleBackRequested() {
    this.navigate('home');
  }

  handleRetryRequested() {
    this.loadCharacterDetails();
  }

  handleFavoriteToggled(event) {
    const character = event.detail.character;
   
    this.dispatchEvent(new CustomEvent('favorite-toggled', {
      detail: { character },
      bubbles: true
    }));
  }

  render() {
    console.log('Rendering character details page:', {
      character: this.character,
      loading: this.loading,
      error: this.error,
      characterId: this.characterId
    });

    if (this.loading) {
      return html`
        <div class="details-page-container">
          <div style="text-align: center; padding: 50px;">
            <div style="font-size: 18px;">Cargando detalles del personaje...</div>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="details-page-container">
          <div style="text-align: center; padding: 50px;">
            <div style="color: red; font-size: 18px;">Error: ${this.error}</div>
            <button @click="${this.handleRetryRequested}" style="margin-top: 20px; padding: 10px 20px;">
              Reintentar
            </button>
          </div>
        </div>
      `;
    }

    if (!this.character) {
      return html`
        <div class="details-page-container">
          <div style="text-align: center; padding: 50px;">
            <div style="font-size: 18px;">No se encontró el personaje</div>
            <button @click="${this.handleBackRequested}" style="margin-top: 20px; padding: 10px 20px;">
              Volver
            </button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="details-page-container">
        <!-- Character Details Component -->
        <character-details
          .character="${this.character}"
          .loading="${this.loading}"
          .error="${this.error}"
          @back-requested="${this.handleBackRequested}"
          @retry-requested="${this.handleRetryRequested}"
          @favorite-toggled="${this.handleFavoriteToggled}"
        ></character-details>
      </div>
    `;
  }
}

customElements.define('character-details-page', CharacterDetailsPage);
