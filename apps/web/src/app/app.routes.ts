import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/houses',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('@oivan/auth/feature').then(m => m.authRoutes),
    title: 'Authentication'
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
