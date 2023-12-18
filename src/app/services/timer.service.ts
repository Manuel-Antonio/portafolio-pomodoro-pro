import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, of, scan, timer } from 'rxjs';
import { IndexdbService } from './indexdb.service';
import { Timer } from '../models/timer';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  dixie : IndexdbService
  constructor() {
    this.dixie = new IndexdbService();
  }
  startTimer(duration: number): Observable<number> {
    return timer(0, 1000).pipe(
      // Emitir el tiempo restante en segundos
      scan((acc) => (acc > 0 ? acc - 1 : 0), duration)
    );
  }

  getTimers(){
    return from(this.dixie.timer.toArray());
  }
  getTimer(id: number){
    return from(this.dixie.timer.get(id));
  }

  addTimer(timer: Timer) {
    return from(this.dixie.timer.add(timer));
  }

  updateTimer(timer: Timer) {
    return from(this.dixie.timer.update(timer.id, timer));
  }

  deleteTimer(id: number){
    return from(this.dixie.timer.delete(id));
  }

  verificarExistencia(timerId: number): Observable<boolean> {
    return from(this.dixie.timer.get(timerId)).pipe(
      // Si el temporizador existe, emite true; de lo contrario, emite false
      map(timer => timer !== undefined),
      catchError(() => of(false))
    );
  }
}
