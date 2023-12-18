import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Task } from '../models/task';
import { Timer } from '../models/timer';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class IndexdbService extends Dexie{

 tasks !: Dexie.Table<Task, number>;
 timer !: Dexie.Table<Timer, number>;
 theme !: Dexie.Table<Theme, number>;
  constructor(){
    super('PomodoroDB')
    this.version(1).stores({
      tasks: 'id, title, description, completed, pomodorosEstimated, pomodorosCompleted, createdAt, deadline, priority, category, reminder, notes',
      timer: 'id, timer',
      theme: 'id, color'
    });
  }
}
