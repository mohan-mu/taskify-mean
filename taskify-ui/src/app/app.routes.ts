import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: 'tasks/new',
  //   pathMatch: 'full',
  //   loadComponent:()=> import('./components/t')

  // },
  // {
  //   path: 'tasks/:id',
  //   pathMatch: 'full',
  //   loadComponent:()=> import('./components/task-form-component/task-form-component.component')

  // },

  {
    path: 'tasks',
    // loadComponent : () =>  import('./tree/tree.component'),
    loadChildren:()=>import('./modules/tasks/tasks.module').then(m => m.TasksModule)
  },

  {
    path: '**',
    loadComponent: () => import('./shared/page-not-found/page-not-found.component')
  }
];
