import { Routes } from '@angular/router';
import { AuthGuard } from '@oivan/auth/feature';
import { HouseListComponent } from './house-list/house-list.component';
import { HouseDetailComponent } from './house-detail/house-detail.component';

export const houseRoutes: Routes = [
  {
    path: '',
    component: HouseListComponent,
    title: 'Houses - House Management'
  },
  {
    path: 'create',
    component: HouseDetailComponent,
    canActivate: [AuthGuard],
    title: 'Create House - House Management'
  },
  {
    path: ':id',
    component: HouseDetailComponent,
    canActivate: [AuthGuard],
    title: 'House Details - House Management'
  },
  {
    path: ':id/edit',
    component: HouseDetailComponent,
    canActivate: [AuthGuard],
    title: 'Edit House - House Management'
  }
];