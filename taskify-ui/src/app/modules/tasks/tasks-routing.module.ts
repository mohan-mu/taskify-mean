import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksHttpService } from './services/tasks-http.service';

const routes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./components/task-form/task-form.component'),
  },
  {
    path: ':taskId',
    loadComponent: () => import('./components/task-form/task-form.component'),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/task-list/task-list.component'),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[TasksHttpService]
})
export class TasksRoutingModule {}
