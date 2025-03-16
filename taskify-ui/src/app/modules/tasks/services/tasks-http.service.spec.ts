import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TasksHttpService } from "./tasks-http.service";
import { environment } from "../../../../environments/environment";
import { Task } from "../interfaces/tasks";

describe('TasksHttpService', () => {
  let service: TasksHttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksHttpService],
    });

    service = TestBed.inject(TasksHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch tasks with given parameters', () => {
    const mockTasks: Task[] = [{ id: '1', title: 'Test Task', completed: false }] as unknown as Task[];
    service.getTasks({ status: 'completed' }).subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/taskify/tasks?status=completed`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a new task', () => {
    const newTask: Task = { id: '2', title: 'New Task', completed: false } as unknown as Task;
    service.createTask(newTask).subscribe((tasks) => {
      expect(tasks).toEqual([newTask]);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/taskify/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush([newTask]);
  });

  it('should fetch a task by ID', () => {
    const mockTask: Task = { id: '1', title: 'Test Task', completed: false } as unknown as Task;
    service.getTask('1').subscribe((response) => {
      expect(response.data).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/taskify/tasks/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTask });
  });

  it('should update a task by ID', () => {
    const updatedTask: Task = { id: '1', title: 'Updated Task', completed: true } as unknown as Task;
    service.updateTask('1', updatedTask).subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/taskify/tasks/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(null);
  });

  it('should delete a task by ID', () => {
    service.deleteTask('1').subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/taskify/tasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
