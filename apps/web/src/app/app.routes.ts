import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/houses',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    redirectTo: '/houses',
    pathMatch: 'full'
  },
  {
    path: 'houses',
    loadChildren: () => import('@oivan/houses/feature').then(m => m.houseRoutes),
    title: 'Houses'
  },
  {
    path: '**',
    redirectTo: '/houses'
  }
];
