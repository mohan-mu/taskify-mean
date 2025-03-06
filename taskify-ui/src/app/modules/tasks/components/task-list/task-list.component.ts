import { TasksHttpService } from './../../services/tasks-http.service';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, delay, map } from 'rxjs';
import { indicate } from '../../../../shared/utils/rxjs.utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskListComponent {
  public isLoading = new BehaviorSubject(false);
  private _tasksHttpService = inject(TasksHttpService);
  public getTasks = this._tasksHttpService
    .getTasks()
    .pipe(indicate(this.isLoading), delay(1200));
}
