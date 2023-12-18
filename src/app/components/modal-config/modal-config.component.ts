import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/services/theme.service';
import { TimerService } from 'src/app/services/timer.service';
import { GlobalService } from 'src/app/shared/global.service';

@Component({
  selector: 'app-modal-config',
  templateUrl: './modal-config.component.html',
  styleUrls: ['./modal-config.component.css']
})
export class ModalConfigComponent implements OnInit {
  frmConfig!: FormGroup;

  @Output() closeModalEvent = new EventEmitter<void>();
  constructor(
    public globalService: GlobalService,
    private themeService: ThemeService,
    private timerService: TimerService,
    private formBuilder: FormBuilder
    ) { 
      this.frmConfig = this.formBuilder.group({
        timerPomodoro: [this.globalService.timerPomodoro || 0],
        timerBreakLong: [this.globalService.timerBreakLong || 0],
        timerBreakShort: [this.globalService.timerBreakShort || 0],
        colorPomodoro: [this.globalService.colorPomodoro || ''],
        colorBreakLong: [this.globalService.colorBreakLong || ''],
        colorBreakShort: [this.globalService.colorBreakShort || ''],
      });
    }

  ngOnInit() {
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  modificarColor(id: number, event: Event) {
    const input :any = event.target as HTMLElement;
    const colorValue = input.value;
    this.globalService.cambiarColorNuevo(colorValue);
    
  }

  // modificarTiempo(id: number, event: Event) {
  //   const input :any = event.target as HTMLElement;
  //   const timerValue = input.value;
    
  // }

  guardarConfiguracion() {
    console.log("Guardar Config")
    if(this.globalService.isVisiblePomodoro) {
      this.globalService.tiempoFormateado = this.globalService.formatTime(this.frmConfig.value.timerPomodoro * 60);
      this.globalService.cambiarColorNuevo(this.frmConfig.value.colorPomodoro);
    }

    if(this.globalService.isVisibleBreakLong){
      this.globalService.tiempoFormateado = this.globalService.formatTime(this.frmConfig.value.timerBreakLong * 60);
      this.globalService.cambiarColorNuevo(this.frmConfig.value.colorBreakLong);
    }
    if(this.globalService.isVisibleBreakShort){
      this.globalService.tiempoFormateado = this.globalService.formatTime(this.frmConfig.value.timerBreakShort * 60);
      this.globalService.cambiarColorNuevo(this.frmConfig.value.colorBreakShort);
    }
    this.globalService.colorPomodoro = this.frmConfig.value.colorPomodoro;
    this.globalService.colorBreakLong = this.frmConfig.value.colorBreakLong;
    this.globalService.colorBreakShort = this.frmConfig.value.colorBreakShort;

   
    this.globalService.timerPomodoro = this.frmConfig.value.timerPomodoro;
    this.globalService.timerBreakLong = this.frmConfig.value.timerBreakLong;
    this.globalService.timerBreakShort = this.frmConfig.value.timerBreakShort;

    this.themeService.updateTheme({id: 1, color: this.frmConfig.value.colorPomodoro});
    this.themeService.updateTheme({id: 2, color: this.frmConfig.value.colorBreakLong});
    this.themeService.updateTheme({id: 3, color: this.frmConfig.value.colorBreakShort});

    this.timerService.updateTimer({id: 1, timer: Number(this.frmConfig.value.timerPomodoro) });
    this.timerService.updateTimer({id: 2, timer: Number(this.frmConfig.value.timerBreakLong) });
    this.timerService.updateTimer({id: 3, timer: Number(this.frmConfig.value.timerBreakShort) });

    this.closeModal();
  }
}
