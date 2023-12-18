import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { GlobalService } from 'src/app/shared/global.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  // Propiedades
  frmTarea!: FormGroup;
  @Output() closeModalEvent = new EventEmitter<void>();


  isVisibleCategoria: boolean = false;
  isVisibleOtraCategoria: boolean = false;
  isVisiblePrioridad: boolean = false;
  isVisibleEliminar: boolean = false;

  categoriaElegida?: string
  prioridadElegida?: string

  taskId : number = 0;

  constructor(
    private formBuilder: FormBuilder,
    public globalService: GlobalService,
    private taskService: TaskService
  ) {
    this.taskId = this.globalService.taskItem?.id || 0;
    this.isVisibleEliminar = this.globalService.estadoModal != "Add";
    this.categoriaElegida = this.globalService.taskItem?.category || 'Ninguno';
    this.prioridadElegida = this.globalService.taskItem?.priority || 'Alta';
    if (this.globalService.taskItem?.category == "Otros" && this.globalService.estadoModal == "Update") {
      this.isVisibleOtraCategoria = true;
    }
    this.frmTarea = this.formBuilder.group({
      title: [this.globalService.taskItem?.title || '', Validators.required],
      pomodoroCompleted: [this.globalService.taskItem?.pomodoroCompleted || '0'],
      pomodoroEstimated: [this.globalService.taskItem?.pomodoroEstimated || '1'],
      category: [this.globalService.taskItem?.category || 'Ninguno'],
      priority: [this.globalService.taskItem?.priority || 'Alta'],
      otherCategory: [this.globalService.taskItem?.otraCategoria || ''],
      notes: [this.globalService.taskItem?.notes || ''],
    });
  }

  // Metodos
  valorCategoria(valor: string, event: Event) {
    this.isVisibleOtraCategoria = false;
    this.categoriaElegida = valor;
    const buttons = document.querySelectorAll('.btnTareaCategoria');
    buttons.forEach(p => {
      let btn = p as HTMLElement;
      btn.style.backgroundColor = 'white';
      btn.style.color = '#27272a';
    })

    const btnHTML = event.target as HTMLElement;
    btnHTML.style.backgroundColor = 'var(--colorGlobal)';
    btnHTML.style.color = 'white';

    if (btnHTML.innerText == "Otros") {
      this.isVisibleOtraCategoria = !this.isVisibleOtraCategoria;
    }
    this.isVisibleCategoria = !this.isVisibleCategoria;
  }

  valorPrioridad(valor: string, event: Event) {
    if (this.isVisibleCategoria) {
      this.isVisibleCategoria = !this.isVisibleCategoria;
    }
    this.prioridadElegida = valor;
    const buttons = document.querySelectorAll('.btnPrioridad');
    buttons.forEach(p => {
      let btn = p as HTMLElement;
      btn.style.backgroundColor = 'white';
      btn.style.color = '#27272a';
    });

    const btnHTML = event.target as HTMLElement;
    btnHTML.style.backgroundColor = 'var(--colorGlobal)';
    btnHTML.style.color = 'white';

    this.isVisiblePrioridad = !this.isVisiblePrioridad;
  }

  switchCategoria() {
    this.isVisiblePrioridad = false;
    this.isVisibleCategoria = !this.isVisibleCategoria;
  }

  switchPrioridad() {
    this.isVisibleCategoria = false;
    this.isVisiblePrioridad = !this.isVisiblePrioridad;

  }

  enviarFormulario() {
    const estado = this.globalService.estadoModal
    if (estado == "Add") {
      this.agregarActualizarTarea("Add");
    } else if (estado === "Update") {
      this.agregarActualizarTarea("Update");
    } else {
      alert("El tipo de estado del Modal no está contemplado");
    }
    this.globalService.isVisibleModal = false;
    this.globalService.estadoModal = "";
    this.closeModal()
  }

  agregarActualizarTarea(estado: string) {
    let tareas = this.globalService.taskList;
    const frm = this.frmTarea.value;

    if (estado === "Add") {
      const tarea: Task = new Task(frm.title, frm.priority);
      tarea.category = this.categoriaElegida;
      if (this.categoriaElegida === "Otros") {
        tarea.otraCategoria = frm.otherCategory;
      }
      tarea.priority = this.prioridadElegida ?? frm.priority;
      tarea.notes = frm.notes;
      tarea.pomodoroCompleted = frm.pomodoroCompleted;
      tarea.pomodoroEstimated = frm.pomodoroEstimated;
      // Guardando en IndexDB
      this.taskService.addTask(tarea);
      tareas = [...tareas, tarea];
    } else if (estado === "Update") {
      const tareaUpdate: any = tareas.find(t => t?.id == this.taskId);
      if (tareaUpdate) {
        tareaUpdate.category = this.categoriaElegida || "";
        tareaUpdate.priority = this.prioridadElegida;
        tareaUpdate.otraCategoria = frm.otherCategory || "";
        tareaUpdate.notes = frm.notes;
        tareaUpdate.title = frm.title;
        tareaUpdate.pomodoroCompleted = frm.pomodoroCompleted;
        tareaUpdate.pomodoroEstimated = frm.pomodoroEstimated;
        // Actulizando en indexDB
        this.taskService.updateTask(tareaUpdate);
        tareas = tareas.map(t => t.id == this.taskId ? tareaUpdate : t);
      }

    }
    this.globalService.taskList = tareas;
    this.globalService.estadoModal = "";

  }

  eliminarTarea() {
    let tareas = this.globalService.taskList;
    tareas = tareas.filter(item => item.id != this.taskId);
    this.globalService.taskList = tareas;
    this.globalService.taskDesafio = new Task();
    // Eliminando de IndexDB
    this.taskService.deleteTask(this.taskId);
    this.closeModal();
  }

  closeModal() {
    this.closeModalEvent.emit();
    this.globalService.taskItem = new Task();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
