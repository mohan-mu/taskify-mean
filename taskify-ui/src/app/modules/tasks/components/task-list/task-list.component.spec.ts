import { TasksHttpService } from "./../../services/tasks-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import TaskListComponent from './task-list.component';
import { of } from 'rxjs';
import { Task, TaskStatus } from '../../interfaces/tasks';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { AsyncPipe, DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";

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
      'getTask',
    ]);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    breakpointObserver = jasmine.createSpyObj('BreakpointObserver', [
      'observe',
    ]);
    route = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, RouterTestingModule,HttpClientTestingModule,  AsyncPipe,
        MatGridListModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        DatePipe,
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,],
      providers: [
        TasksHttpService
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
    component.ngOnInit();

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
    component.changeStatus(
      { checked: true } as MatCheckboxChange,
      task as unknown as Task
    );
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

    expect(component.cols).toBe(4);
  });
});
