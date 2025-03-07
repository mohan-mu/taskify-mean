import { ComponentFixture, TestBed } from '@angular/core/testing';

import TaskListComponent from './task-list.component';
import { of } from 'rxjs';
import { Task, TaskStatus } from '../../interfaces/tasks';
import { TasksHttpService } from '../../services/tasks-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let tasksHttpService: jasmine.SpyObj<TasksHttpService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    tasksHttpService = jasmine.createSpyObj('TasksHttpService', [
      'deleteTask',
      'getTasks',
      'updateTask',
    ]);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    breakpointObserver = jasmine.createSpyObj('BreakpointObserver', [
      'observe',
    ]);
    route = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TasksHttpService, useValue: tasksHttpService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: BreakpointObserver, useValue: breakpointObserver },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on init', () => {
    const tasks = [
      { _id: '1', title: 'Test Task', status: TaskStatus.Pending },
    ];
    tasksHttpService.getTasks.and.returnValue(of(tasks as unknown as Task[]));
    // route.queryParams.and.returnValue(of({}));

    component.ngOnInit();

    expect(tasksHttpService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(tasks as unknown as Task[]);
  });

  it('should delete a task', () => {
    tasksHttpService.deleteTask.and.returnValue(of({}));
    spyOn(component, 'fetchTasks');

    component.deleteTask('1');

    expect(tasksHttpService.deleteTask).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith('Task Deleted', '', {
      duration: 1400,
    });
    expect(component.fetchTasks).toHaveBeenCalled();
  });

  it('should change task status', () => {
    const task = {
      _id: '1',
      title: 'Test Task',
      status: TaskStatus.Pending,
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
    };
    tasksHttpService.updateTask.and.returnValue(of({}));
    spyOn(component, 'fetchTasks');

    component.changeStatus(
      { checked: true } as MatCheckboxChange,
      task as unknown as Task
    );

    expect(tasksHttpService.updateTask).toHaveBeenCalledWith('1', {
      ...task,
      status: TaskStatus.Completed,
    } as unknown as Task);
    expect(snackBar.open).toHaveBeenCalledWith('Task Updated', '', {
      duration: 1400,
    });
    expect(component.fetchTasks).toHaveBeenCalled();
  });

  it('should update columns based on breakpoint', () => {
    const breakpoints = {
      [Breakpoints.XSmall]: true,
      [Breakpoints.Medium]: false,
      [Breakpoints.Large]: false,
    };
    breakpointObserver.observe.and.returnValue(
      of({ matches: true, breakpoints })
    );

    component.ngOnInit();

    expect(component.cols).toBe(1);
  });
});
