import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Task } from '../models/task';
import { Observable, Subject, Subscriber } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { TimerService } from '../services/timer.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // Propiedades globales
  taskList: Task[] = [];
  taskListCompleted: Task[] = [];
  taskDesafio: Task = new Task();
  taskItem: Task = new Task();
  estadoModal: string = "";
  isVisibleModal: boolean = false;
  timerPomodoro: number = 25;
  timerBreakLong: number = 15;
  timerBreakShort: number = 5;
  colorPomodoro?: string = "";
  colorBreakLong?: string = "";
  colorBreakShort?: string = "";
  tiempoFormateado?: string;

  isVisiblePomodoro:boolean = false;
  isVisibleBreakLong:boolean = false;
  isVisibleBreakShort:boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private timerService: TimerService, private themeService: ThemeService) {
    
    this.timerService.getTimer(1).subscribe(result => {
      this.tiempoFormateado = this.formatTime((result?.timer  || 0) * 60)
    });
    this.timerService.getTimers().subscribe(listado => listado.forEach(timer => {
      if (timer.id == 1) {
        this.timerPomodoro = timer.timer;
      } else if (timer.id == 2) {
        this.timerBreakLong = timer.timer;
      } else if (timer.id == 3) {
        this.timerBreakShort = timer.timer;
      }
    }));

    this.themeService.getThemes().subscribe(listado => listado.forEach(theme => {
      if (theme.id == 1) {
        this.colorPomodoro = theme.color;
      } else if (theme.id == 2) {
        this.colorBreakLong = theme.color;
      } else if (theme.id == 3) {
        this.colorBreakShort = theme.color;
      }
    }));
  }

  // Metodos globales
  cambiarColorNuevo(colorNuevo: string): void {
    this.document.documentElement.style.setProperty('--colorGlobal', colorNuevo);
  }

  itemCompletado() {
    this.taskList = this.taskList.map(task => {
      if (task.id == this.taskDesafio?.id) {
        task.pomodoroCompleted = Number(task.pomodoroCompleted) + 1;
        console.log(task)
      }
      return task;
    });

  }
  formatTime(seconds: number): string {
    const minutos = Math.floor(seconds / 60);
    const segundos = seconds % 60;
    return `${this.padNumber(minutos)}:${this.padNumber(segundos)}`;
  }

  private padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

}
