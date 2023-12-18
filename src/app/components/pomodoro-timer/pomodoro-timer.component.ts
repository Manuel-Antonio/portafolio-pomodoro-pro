import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { TimerService } from 'src/app/services/timer.service';
import { GlobalService } from 'src/app/shared/global.service';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.css']
})
export class PomodoroTimerComponent implements OnInit, OnDestroy {
  tiempoRestante: number = 0;
  
  timerPaused: boolean = false;
  barraAnimada?: number = 0;
  tiempoSeleccionado !: number;
  btnSeleccionado: boolean = false;
  isModalOpen = false;
  private timerSubscription !: Subscription;

  constructor(
    private timerService: TimerService,
    public globalService: GlobalService,
    public themeService: ThemeService
  ) {
  }
  ngOnInit(): void {
    this.timerService.getTimer(1).subscribe(result => {
      this.tiempoRestante = (result?.timer || 0) * 60;
      this.tiempoSeleccionado = this.tiempoRestante;
      this.globalService.tiempoFormateado = this.globalService.formatTime(this.tiempoRestante != 0 ? this.tiempoRestante : 25 * 60);
    });
   
    
  }

  // Metodos de tiempo 
  toggleTimer(): void {
    this.timerPaused = !this.timerPaused;
    if (this.timerPaused) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  stopTimer(): void {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer(): void {
    this.timerSubscription = this.timerService.startTimer(this.tiempoRestante).subscribe(
      tiempo => {
        this.tiempoRestante = tiempo;
        this.barraAnimada = ((this.tiempoSeleccionado - this.tiempoRestante) / (this.tiempoSeleccionado)) * 100;
        this.globalService.tiempoFormateado = this.globalService.formatTime(this.tiempoRestante);
        if (this.tiempoRestante == 0) {
          this.reproducirAlarma();
          this.globalService.itemCompletado();
          this.ngOnDestroy();
          const btn1 = document.querySelector(".btn-opcion") as HTMLButtonElement;

          this.resetear(this.globalService.timerPomodoro * 60, 1, btn1);
        }
      },
      null,
      () => console.log('El temporizador ha completado')
    );
  }
  configTimer() {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Metodos Auxiliares
  resetear(time: number, id: number, btn: HTMLButtonElement) {
    this.themeService.getTheme(id).subscribe(result => this.cambiarColor(result?.color || ""));
    this.modificarVisibilidadTimer(id);
    this.stopTimer(); // Detener el temporizador actual
    this.timerPaused = false;
    this.barraAnimada = 0;
    this.tiempoSeleccionado = time;
    this.tiempoRestante = time;
    this.globalService.tiempoFormateado = this.globalService.formatTime(this.tiempoRestante);
    const buttons = document.querySelectorAll('.btn-opcion');
    buttons.forEach(p => {
      let btn = p as HTMLElement;
      btn.style.backgroundColor = '#d4d4d470';
    })
    btn.style.backgroundColor = 'var(--colorGlobal)';
  }
  
  modificarVisibilidadTimer(id : number){
    this.globalService.isVisiblePomodoro = false;
    this.globalService.isVisibleBreakLong = false;
    this.globalService.isVisibleBreakShort = false;
    if(id == 1) {
      this.globalService.isVisiblePomodoro = true;
    }else if (id == 2) {
      this.globalService.isVisibleBreakLong = true;
    }else if (id == 3) {
      this.globalService.isVisibleBreakShort = true;
    }
  }
  cambiarColor(color: string) {
    this.globalService.cambiarColorNuevo(color);
  }

  reproducirAlarma(): void {
    const audio = new Audio('assets/alarma.mp3');
    audio.volume = .7; // Rango 0 -1
    audio.play();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }


}
