import { ComponentFixture, TestBed } from '@angular/core/testing';

import TaskFormComponent from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TasksHttpService } from '../../services/tasks-http.service';
import { of } from 'rxjs';
import { TaskPriority, TaskStatus } from '../../interfaces/tasks';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let tasksHttpService: jasmine.SpyObj<TasksHttpService>;

  beforeEach(async () => {
    tasksHttpService = jasmine.createSpyObj('TasksHttpService', [
      'getTask',
      'createTask',
      'updateTask',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule],
      declarations: [TaskFormComponent],
      providers: [{ provide: TasksHttpService, useValue: tasksHttpService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.tasksForm;
    expect(form.get('title')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
    expect(form.get('dueDate')?.value).toEqual(new Date());
    expect(form.get('priority')?.value).toBe(TaskPriority.Low);
    expect(form.get('status')?.value).toBe(TaskStatus.Pending);
  });

  it('should call getTask and set form values if taskId is provided', () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: TaskPriority.High,
      status: TaskStatus.Completed,
      _id: '123',
    };
    tasksHttpService.getTask.and.returnValue(of({ data: taskData }));
    component['taskId'] = '123' as any;
    component.ngOnInit();
    expect(tasksHttpService.getTask).toHaveBeenCalledWith('123');
    expect(component.tasksForm.value).toEqual(taskData);
  });

  it('should call createTask on submit if taskId is not provided', () => {
    const taskData = {
      title: 'New Task',
      description: 'New Description',
      dueDate: new Date(),
      priority: TaskPriority.Medium,
      status: TaskStatus.Pending,
    };
    component.tasksForm.setValue({ ...taskData, _id: '' });
    tasksHttpService.createTask.and.returnValue(of({}) as any);
    component.onSubmit();
    expect(tasksHttpService.createTask).toHaveBeenCalledWith(taskData);
  });

  it('should call updateTask on submit if taskId is provided', () => {
    const taskData = {
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: new Date(),
      priority: TaskPriority.High,
      status: TaskStatus.Completed,
      _id: '123',
    };
    component['taskId'] = '123' as any;
    component.tasksForm.setValue(taskData);
    tasksHttpService.updateTask.and.returnValue(of({}));
    component.onSubmit();
    expect(tasksHttpService.updateTask).toHaveBeenCalledWith('123', taskData);
  });
});
