import { TTime } from "./../../../../../node_modules/memfs/lib/node/types/misc.d";
import { FormControl } from "@angular/forms";

export interface Task {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority,
  status: TaskStatus,
  createdBy?:any,
  _id?: string;
}

export enum TaskPriority{
  Low = 'Low',
  Medium = 'Medium',
  High='High'
}

export enum TaskStatus{
  Pending = 'Pending',
  Completed = 'Completed',
}


export interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string>;
  dueDate: FormControl<Date>;
  priority: FormControl<string>,
  status: FormControl<string>,
}
