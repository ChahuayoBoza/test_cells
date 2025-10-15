import { LitElement, html, css } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';
import '../ui-components/character-details.js';
import '../data-managers/simpsons-data-manager.js';


export class CharacterDetailsPage extends PageMixin(LitElement) {

  character = null;
  characterId = null;
  loading = false;
  error = null;

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

  constructor() {
    super();
    
    this.simpsonsDataManager = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    const routeParams = this.getRouteParams();
    if (routeParams && routeParams.id) {
      this.characterId = routeParams.id;
    }
  }

  firstUpdated() {
    this.simpsonsDataManager = this.shadowRoot.querySelector('simpsons-data-manager');
    
    if (this.characterId) {
      this.loadCharacterDetails();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('characterId') && this.characterId) {
      this.loadCharacterDetails();
    }
  }

  async loadCharacterDetails() {
    if (this.simpsonsDataManager && this.characterId) {
      this.loading = true;
      this.error = null;
      await this.simpsonsDataManager.fetchCharacterDetails(this.characterId);
    }
  }

  handleCharacterDetailsLoaded(event) {
    this.character = event.detail.character;
    this.loading = false;
    this.error = null;
  }

  handleCharacterDetailsError(event) {
    this.error = event.detail.error;
    this.loading = false;
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
    return html`
      <div class="details-page-container">
        <!-- Data Manager (invisible) -->
        <simpsons-data-manager
          @character-details-loaded="${this.handleCharacterDetailsLoaded}"
          @character-details-error="${this.handleCharacterDetailsError}"
        ></simpsons-data-manager>

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
