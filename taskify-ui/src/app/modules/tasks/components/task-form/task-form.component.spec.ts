import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { TaskPriority, TaskStatus } from "../../interfaces/tasks";
import { TasksHttpService } from "../../services/tasks-http.service";
import TaskFormComponent from "./task-form.component";
import { AsyncPipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatNativeDateModule } from "@angular/material/core";

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let tasksHttpService: jasmine.SpyObj<TasksHttpService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const tasksHttpServiceSpy = jasmine.createSpyObj('TasksHttpService', ['getTask', 'updateTask', 'createTask']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent,MatInputModule,
          MatButtonModule,
          MatSelectModule,
          MatRadioModule,
          MatCardModule,
          ReactiveFormsModule,
          MatProgressSpinnerModule,
          MatNativeDateModule,
          AsyncPipe,],
      providers: [
        { provide: TasksHttpService, useValue: tasksHttpServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    tasksHttpService = TestBed.inject(TasksHttpService) as jasmine.SpyObj<TasksHttpService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.tasksForm.value).toEqual({
      title: '',
      description: '',
      dueDate: jasmine.any(Date),
      priority: TaskPriority.Low,
      status: TaskStatus.Pending,
    });
  });

  it('should set form values when taskId is provided and isEdit is true', () => {
    const mockTask = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: TaskPriority.High,
      status: TaskStatus.Completed,
      _id: '123',
    };

    component.taskId = '123'
    tasksHttpService.getTask.and.returnValue(of({ data: mockTask }));

    component.ngOnInit();

    expect(tasksHttpService.getTask).toHaveBeenCalledWith('123');
  });

  it('should call createTask on submit when not in edit mode', () => {
    const mockTask = {
      title: 'New Task',
      description: 'New Description',
      dueDate: new Date(),
      priority: TaskPriority.Medium,
      status: TaskStatus.Pending,
    };

    component.tasksForm.setValue({ ...mockTask, _id: '' });
    tasksHttpService.createTask.and.returnValue(of([]));

    component.onSubmit();

    expect(tasksHttpService.createTask).toHaveBeenCalledWith(mockTask);
  });

  it('should call updateTask on submit when in edit mode', () => {
    const mockTask = {
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: new Date(),
      priority: TaskPriority.High,
      status: TaskStatus.Completed,
    };

    component.taskId = '123';
    component.tasksForm.setValue({ ...mockTask, _id: '123' });
    tasksHttpService.updateTask.and.returnValue(of({}));

    component.onSubmit();

    expect(tasksHttpService.updateTask).toHaveBeenCalledWith('123', mockTask);
  });

});
