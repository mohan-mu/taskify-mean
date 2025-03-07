import { TasksHttpService } from './../../services/tasks-http.service';
import { AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, delay, map } from 'rxjs';
import { indicate } from '../../../../shared/utils/rxjs.utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task, TaskStatus } from '../../interfaces/tasks';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterLink } from '@angular/router';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';

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
    RouterLink,
    DatePipe,
    MatCheckboxModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskListComponent implements OnInit {
  public isLoading = new BehaviorSubject(false);
  public cols = 5;
  public tasks: Task[] = [];

  public readonly taskStatus = TaskStatus

  private _gridByBreakpoint = {
    lg: 5,
    md: 4,
    xs: 2,
  };
  private breakpointObserver = inject(BreakpointObserver);
  private _snackBar = inject(MatSnackBar);
  private _cdr = inject(ChangeDetectorRef);
  private _tasksHttpService = inject(TasksHttpService);

  ngOnInit(): void {
    this.fetchTasks();
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Medium, Breakpoints.Large])
      .subscribe(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.cols = this._gridByBreakpoint.xs;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.cols = this._gridByBreakpoint.md;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.cols = this._gridByBreakpoint.lg;
          }
        }
        this._cdr.markForCheck();
      });
  }

  /*
   * @param id
   * @returns void
   * @description Delete a task
   * */
  public deleteTask(id: string = '') {
    return this._tasksHttpService.deleteTask(id).subscribe(() => {
      this._snackBar.open('Task Deleted', '', {
        duration: 1400,
      });
      this.fetchTasks();
    });
  }

  /*
   * @returns void
   * @description Fetch all tasks
   * */
  public fetchTasks() {
    this._tasksHttpService
      .getTasks()
      .pipe(delay(700), indicate(this.isLoading))
      .subscribe(data => {
        this.tasks = data;
        this._cdr.markForCheck();
      });
  }

  /*
   * @param task
   * @returns void
   * @description Mark a task status
   * */
  public changeStatus({checked}: MatCheckboxChange, task: Task) {
    console.log('task', task,checked);
    const status = checked ? TaskStatus.Completed : TaskStatus.Pending;
    this._tasksHttpService.updateTask(task?._id, {...task, status}).subscribe(() => {
      this._snackBar.open('Task Updated', '', {
        duration: 1400,
      });
      this.fetchTasks();
    });
  }
}
