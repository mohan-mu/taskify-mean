import { TasksHttpService } from './../../services/tasks-http.service';
import { AsyncPipe } from '@angular/common';
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
import { Task } from '../../interfaces/tasks';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterLink } from '@angular/router';

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
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskListComponent implements OnInit {
  public isLoading = new BehaviorSubject(false);
  public cols = 6;
  public tasks: Task[] = [];
  gridByBreakpoint = {
    lg: 6,
    md: 5,
    xs: 2
  }

  private breakpointObserver = inject(BreakpointObserver);
  private _snackBar = inject(MatSnackBar);
  private _cdr = inject(ChangeDetectorRef);
  private _tasksHttpService = inject(TasksHttpService);

  ngOnInit(): void {
    this.fetchTasks();
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Medium,
      Breakpoints.Large,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }

      }
      this._cdr.markForCheck()
    });
  }

  public deleteTask(id: string = '') {
    return this._tasksHttpService.deleteTask(id).subscribe(() => {
      this._snackBar.open('Task Deleted', '', {
        duration:1400
      });
      this.fetchTasks();
    });
  }

  public fetchTasks() {
    this._tasksHttpService
      .getTasks()
      .pipe(delay(700), indicate(this.isLoading))
      .subscribe(data => {
        this.tasks = data;
        this._cdr.markForCheck();
      });
  }
}
