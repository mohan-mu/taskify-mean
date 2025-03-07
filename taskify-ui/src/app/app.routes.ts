import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { AUTH_KEY } from './shared/constants/constants';

const canActivateTeam: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):boolean => {
  if (localStorage.getItem(AUTH_KEY)) {
    return true;
  }

  // not logged in so redirect to login page with the return url
  inject(Router).navigate(['auth/signin'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

export const routes: Routes = [
  {
    path: 'tasks',
    canActivate: [canActivateTeam],
    loadComponent: () =>
      import(
        './shared/components/navigation-toolbar/navigation-toolbar.component'
      ),
    loadChildren: () =>
      import('./modules/tasks/tasks.module').then(m => m.TasksModule),
  },
  {
    path: 'auth/signin',
    loadComponent: () =>
      import('./components/auth/signin/signin.component'),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./components/auth/signup/signup.component'),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/page-not-found/page-not-found.component'),
  },
];

