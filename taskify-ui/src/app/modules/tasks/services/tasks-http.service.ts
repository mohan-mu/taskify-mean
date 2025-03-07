import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../interfaces/tasks';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TasksHttpService {
  private _http = inject(HttpClient);
  private _url = environment.apiUrl;

  getTasks(params={}) {
    return this._http.get<Task[]>(`${this._url}/tasks`,{params});
  }
  createTask(task: Task) {
    return this._http.post<Task[]>(`${this._url}/tasks`, { ...task });
  }

  getTask(id:string ='') {
    return this._http.get<{ data: Task }>(`${this._url}/tasks/${id}`);
  }

  updateTask(id: string='', task: Task) {
    return this._http.put(`${this._url}/tasks/${id}`, task);
  }

  deleteTask(id: string) {
    return this._http.delete(`${this._url}/tasks/${id}`);
  }
}
