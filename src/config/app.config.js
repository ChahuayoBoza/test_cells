
export const appConfig = {
  name: 'Los Simpsons App',
  version: '1.0.0',
  description: 'TEST CELLS',
  
  api: {
    baseUrl: 'https://thesimpsonsapi.com',
    endpoints: {
      characters: '/api/characters',
      character: '/api/character'
    }
  },
  
  app: {
    title: 'Los Simpsons',
    subtitle: 'Explora los personajes de Springfield',
    theme: {
      primaryColor: '#ff6b35',
      secondaryColor: '#f7931e',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  
  search: {
    debounceTime: 300,
    minSearchLength: 1,
    maxSuggestions: 5
  },
  
  pagination: {
    itemsPerPage: 20,
    maxVisiblePages: 5
  }
};
