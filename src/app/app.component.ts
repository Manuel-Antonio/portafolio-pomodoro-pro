import { Component, Inject } from '@angular/core';
import { IndexdbService } from './services/indexdb.service';
import { Task } from './models/task';
import { GlobalService } from './shared/global.service';
import { DOCUMENT } from '@angular/common';
import { TaskService } from './services/task.service';
import { Timer } from './models/timer';
import { ThemeService } from './services/theme.service';
import { TimerService } from './services/timer.service';
import { Theme } from './models/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pomodoro';
  constructor(
    public globalService: GlobalService,
    private taskService: TaskService,
    private timerService: TimerService,
    private themeService: ThemeService
  ) {
    // Agregar temporizadores al servicio en el inicio del componente
    this.themeService.getTheme(1).subscribe(result => this.globalService.cambiarColorNuevo(result?.color || ""));
    this.agregarTemporizadores();
    this.agregarThemes();
    this.taskService.getTasks().subscribe(result => result.forEach(task => {
      if (task.completed) {
        this.globalService.taskListCompleted = [...this.globalService.taskListCompleted, task];
      } else {
        this.globalService.taskList = [...this.globalService.taskList, task];
      }
    }));
  }


  private agregarThemes() {
    const themes: Theme[] = [
      new Theme(1, '#ef4444'),
      new Theme(2, '#47a9b0'),
      new Theme(3, '#0078d4')
    ];

    // Agregar cada temporizador de forma segura usando el servicio de temporizadores
    themes.forEach(theme => {
      this.agregarThemeDeFormaSegura(theme);
    });
  }
  private agregarThemeDeFormaSegura(theme: Theme) {
    this.themeService.verificarExistencia(theme.id).subscribe(
      (existe: boolean) => {
        if (!existe) {

          this.themeService.addTheme(theme).subscribe(
            () => console.log(`Theme ${theme.id} agregado con éxito`),
            (error) => console.error(`Error al intentar agregar el temporizador ${theme.id}:`, error)
          );
        } else {
          //console.warn(`El temporizador con ID ${temporizador.id} ya existe en la base de datos. No se agregará.`);
        }
      },
      (error) => console.error(`Error al verificar la existencia del temporizador ${theme.id}:`, error)
    );
  }
  private agregarTemporizadores() {
    const temporizadores: Timer[] = [
      new Timer(1, 25),
      new Timer(2, 15),
      new Timer(3, 5)
    ];

    // Agregar cada temporizador de forma segura usando el servicio de temporizadores
    temporizadores.forEach(temporizador => {
      this.agregarTemporizadorDeFormaSegura(temporizador);
    });
  }
  // Método para agregar un temporizador de forma segura
  private agregarTemporizadorDeFormaSegura(temporizador: Timer) {
    this.timerService.verificarExistencia(temporizador.id).subscribe(
      (existe: boolean) => {
        if (!existe) {
          // El temporizador no existe, entonces podemos agregarlo de forma segura
          this.timerService.addTimer(temporizador).subscribe(
            () => console.log(`Temporizador ${temporizador.id} agregado con éxito`),
            (error) => console.error(`Error al intentar agregar el temporizador ${temporizador.id}:`, error)
          );
        } else {
          //console.warn(`El temporizador con ID ${temporizador.id} ya existe en la base de datos. No se agregará.`);
        }
      },
      (error) => console.error(`Error al verificar la existencia del temporizador ${temporizador.id}:`, error)
    );
  }

}
