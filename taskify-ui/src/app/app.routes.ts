import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () =>
      import(
        './shared/components/navigation-toolbar/navigation-toolbar.component'
      ),
    loadChildren: () =>
      import('./modules/tasks/tasks.module').then(m => m.TasksModule),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/page-not-found/page-not-found.component'),
  },
];
