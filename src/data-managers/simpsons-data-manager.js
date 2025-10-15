import { LitElement, html } from 'lit';

export class SimpsonsDataManager extends LitElement {
  static properties = {
    characters: { type: Array },
    loading: { type: Boolean },
    error: { type: String },
    selectedCharacter: { type: Object }
  };

  constructor() {
    super();
    this.characters = [];
    this.loading = false;
    this.error = null;
    this.selectedCharacter = null;
    this.apiBaseUrl = 'https://thesimpsonsapi.com';
  }
 
  async fetchCharacters() {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/characters`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();

      let characters = [];
      
      if (Array.isArray(data)) {
        characters = data;
      } else if (data && Array.isArray(data.characters)) {
        characters = data.characters;
      } else if (data && Array.isArray(data.data)) {
        characters = data.data;
      } else if (data && data.results && Array.isArray(data.results)) {
        characters = data.results;
      } else {
        characters = [];
      }
      
      this.characters = characters;
      
      this.dispatchEvent(new CustomEvent('characters-loaded', {
        detail: { characters: this.characters },
        bubbles: true
      }));
      
    } catch (error) {
      this.error = error.message;
      
      this.dispatchEvent(new CustomEvent('characters-error', {
        detail: { error: this.error },
        bubbles: true
      }));
    } finally {
      this.loading = false;
    }
  }

  async fetchCharacterDetails(characterId) {
    this.loading = true;
    this.error = null;
    
    try {
      let character = this.characters.find(char => char.id === characterId);
      
      if (!character) {
        const response = await fetch(`${this.apiBaseUrl}/api/character/${characterId}`);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && typeof data === 'object') {
          character = data;
        } else if (data && data.character) {
          character = data.character;
        } else if (data && data.data) {
          character = data.data;
        }
      }
      
      if (!character) {
        throw new Error(`Personaje con ID ${characterId} no encontrado`);
      }
      
      this.selectedCharacter = character;
      
      this.dispatchEvent(new CustomEvent('character-details-loaded', {
        detail: { character: this.selectedCharacter },
        bubbles: true
      }));
      
    } catch (error) {
      this.error = error.message;
      
      this.dispatchEvent(new CustomEvent('character-details-error', {
        detail: { error: this.error },
        bubbles: true
      }));
    } finally {
      this.loading = false;
    }
  }

  searchCharacters(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      // Si no hay término de búsqueda, mostrar todos
      this.dispatchEvent(new CustomEvent('characters-filtered', {
        detail: { characters: this.characters },
        bubbles: true
      }));
      return;
    }

    const filteredCharacters = this.characters.filter(character => 
      character.name && character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.dispatchEvent(new CustomEvent('characters-filtered', {
      detail: { characters: filteredCharacters },
      bubbles: true
    }));
  }

  getCharacterById(characterId) {
    return this.characters.find(char => char.id === characterId);
  }
 
  clearSelectedCharacter() {
    this.selectedCharacter = null;
    this.dispatchEvent(new CustomEvent('character-cleared', {
      bubbles: true
    }));
  }

  render() {
    return html``;
  }
}

customElements.define('simpsons-data-manager', SimpsonsDataManager);
