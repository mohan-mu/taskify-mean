import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
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
import { BehaviorSubject, delay, iif } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskFormComponent implements OnInit {
  private _tasksHttpService = inject(TasksHttpService);
  public isLoading = new BehaviorSubject(false);
  private _snackBar = inject(MatSnackBar);
  readonly minDate = new Date();
  private _fb = inject(FormBuilder);

  tasksForm = this._fb.group(
    {
      title: ['', Validators.required],
      description: [''],
      dueDate: [new Date()],
      priority: [TaskPriority.Low],
      status: [TaskStatus.Pending],
      _id: [{ disabled: true, value: '' }],
    },
    { nonNullable: true }
  );

  @Input() taskId: string| undefined = undefined;

  ngOnInit(): void {
    if (this.isEdit && this.taskId) {
      // TODO : Progressbar When Loading
      this._tasksHttpService.getTask(this.taskId).subscribe(({ data }) => {
        this.tasksForm.setValue({ ...data });
      });
    }
  }

  get isEdit() {
    return this.taskId !== undefined;
  }

  onSubmit(): void {
    const task = this.tasksForm.value;
    iif(
      () => this.isEdit,
      this._tasksHttpService.updateTask(this.tasksForm.get('_id')?.value, task),
      this._tasksHttpService.createTask(task)
    )
      .pipe(delay(700), indicate(this.isLoading))
      .subscribe(() => {
        this._snackBar.open(
          `${this.tasksForm.get('title')?.value} ${this.isEdit ? 'Updated' : 'Created'}`,
          '',
          {
            duration: 1400,
          }
        );
        this.tasksForm.reset({
          title: '',
          description: '',
          dueDate: new Date(),
          priority: TaskPriority.Low,
          status: TaskStatus.Pending,
        });
      });
  }
}
