import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TaskPriority, TaskStatus } from '../../interfaces/tasks';
import { TasksHttpService } from '../../services/tasks-http.service';
import { indicate } from '../../../../shared/utils/rxjs.utils';
import { BehaviorSubject, delay } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export default class TaskFormComponent {
  private _tasksHttpService = inject(TasksHttpService);
  public isLoading = new BehaviorSubject(false);

  readonly minDate = new Date();
  private _fb = inject(FormBuilder);
  tasksForm = this._fb.group(
    {
      title: ['', Validators.required],
      description: [''],
      dueDate: [new Date()],
      priority: [TaskPriority.Low],
      status: [TaskStatus.Pending],
    },
    { nonNullable: true }
  );
  onSubmit(): void {
    const task = this.tasksForm.value;
    this._tasksHttpService
      .createTask(task)
      .pipe(indicate(this.isLoading), delay(700))
      .subscribe(() => {
        this.tasksForm.reset();
      });
  }
}
