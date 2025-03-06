import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Tasks } from '../interfaces/tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksHttpService {
  private _http = inject(HttpClient)
  url=''

  getEmployee(id: string) {
    this._http.get<Tasks>(`${this.url}/employees/${id}`).subscribe(employee => {
    });
  }

  createEmployee(employee: Tasks) {
    return this._http.post(`${this.url}/employees`, employee, { responseType: 'text' });
  }

  updateEmployee(id: string, employee: Tasks) {
    return this._http.put(`${this.url}/employees/${id}`, employee, { responseType: 'text' });
  }

  deleteEmployee(id: string) {
    return this._http.delete(`${this.url}/employees/${id}`, { responseType: 'text' });
  }
}
