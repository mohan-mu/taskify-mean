import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./components/task-form/task-form.component'),
  },
  // {
  //   path: 'new',
  //   loadComponent:()=> import('../../test/test.component')
  // },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/task-list/task-list.component'),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
