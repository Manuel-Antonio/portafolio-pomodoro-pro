import { Component } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { GlobalService } from 'src/app/shared/global.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent{
  // Propiedades
  tareas :Task[] = []
  isModalOpen = false;
  typeList:boolean = false;
  constructor( public globalService: GlobalService, private taskService: TaskService) {
    
  }

  // Metodos
  modoAdd() {
    if(this.isModalOpen && this.globalService.estadoModal == "Update"){
      alert("Cierra primero la ventana actual");
      return;
    }
    this.globalService.estadoModal = "Add";
    this.isModalOpen = !this.isModalOpen;

  }

  modoUpdate(item : Task) {
    if(this.isModalOpen && this.globalService.estadoModal == "Add"){
      alert("Cierra primero la ventana actual");
      return;
    }
    this.globalService.estadoModal = "Update";
    this.isModalOpen = !this.isModalOpen;
    this.globalService.taskItem = item;
  }

  modoDelete() {
    this.globalService.estadoModal = "Delete";
  }

  closeModal() {
    this.isModalOpen = false;
  }

  completedTask(item : Task) {
    item.completed = !item.completed;
    if(item.completed){
      this.globalService.taskDesafio = new Task();
      let tareasPendientes = this.globalService.taskList;
      tareasPendientes = tareasPendientes.filter(t => t.id != item.id);
      this.globalService.taskList = tareasPendientes;
      let tareasCompletadas = this.globalService.taskListCompleted;
      tareasCompletadas = [...tareasCompletadas, item];
      this.globalService.taskListCompleted = tareasCompletadas;
    }else {
      let tareasCompletadas = this.globalService.taskListCompleted;
      tareasCompletadas = tareasCompletadas.filter(t => t.id != item.id);
      this.globalService.taskListCompleted = tareasCompletadas;
      let tareasPendientes = this.globalService.taskList;
      tareasPendientes = [...tareasPendientes, item];
      this.globalService.taskList = tareasPendientes;
    }
    this.taskService.updateTask(item);
  }
  seleccionarItem(item: any, event: MouseEvent): void {
    // Verificar que el clic no provenga de los botones específicos
    const target = event.target as HTMLElement;
    const isButton1 = target.closest('.clase-del-primer-button');
    const isButton2 = target.closest('.clase-del-segundo-button');

    if (!isButton1 && !isButton2) {
      // Lógica de selección del item
      // Puedes agregar o quitar la lógica según tus necesidades
      item.seleccionado = !item.seleccionado;
      this.globalService.taskDesafio = item;
    }
  }
  eliminarTaskCompleted(task : Task) {
    let tareasCompletadas = this.globalService.taskListCompleted;
    tareasCompletadas = tareasCompletadas.filter(t => t.id != task.id);
    this.globalService.taskListCompleted = tareasCompletadas;
    this.taskService.deleteTask(task.id);
  }
}

