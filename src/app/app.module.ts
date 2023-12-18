import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PomodoroTimerComponent } from './components/pomodoro-timer/pomodoro-timer.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { ModalConfigComponent } from './components/modal-config/modal-config.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [	
    AppComponent,
      PomodoroTimerComponent,
      TaskListComponent,
      StatisticsComponent,
      ModalComponent,
      ModalConfigComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
