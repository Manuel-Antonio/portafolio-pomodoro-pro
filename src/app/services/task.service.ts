import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { Task } from '../models/task';
import { IndexdbService } from './indexdb.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  dixie : IndexdbService
  constructor() {
    this.dixie = new IndexdbService();
  }

  getTasks(){
    return from(this.dixie.tasks.toArray());
  }

  addTask(task: Task) {
    return this.dixie.tasks.add(task);
  }

  updateTask(task: Task) {
    return this.dixie.tasks.update(task.id, task);
  }

  deleteTask(id: number){
    return this.dixie.tasks.delete(id);
  }
}
