export const routes = [
  {
    path: '/',
    component: 'home-page',
    name: 'home',
    action: () => import('../pages/home-page.js')
  },
  {
    path: '/character/:id',
    component: 'character-details-page',
    name: 'character-details',
    action: () => import('../pages/character-details-page.js')
  },
  {
    path: '/character',
    component: 'character-details-page',
    name: 'character-details-query',
    action: () => import('../pages/character-details-page.js')
  }
];
