export class Task {
    id!: number;  // Identificador único de la tarea.
    title?: string = "";  // Título de la tarea.
    completed?: boolean;  // Indica si la tarea está completada o no.
    pomodoroEstimated?: number;  // Cantidad estimada de pomodoros para completar la tarea.
    pomodoroCompleted: number = 0;  // Cantidad de pomodoros ya completados para la tarea.
    createdAt?: Date;  // Fecha de creación de la tarea.
    priority?: string;  // Prioridad de la tarea (por ejemplo, 'low', 'medium', 'high').
    category?: string;  // Categoría a la que pertenece la tarea.
    notes?: string;  // Notas adicionales relacionadas con la tarea. 'low' | 'medium' | 'high'
    otraCategoria?:string;
    constructor(title: string = "", priority: string="") {
        this.id = Date.now();
        this.title = title;
        this.priority = priority;
        this.completed = false;
        this.createdAt = new Date();
        this.category = "";
        this.pomodoroCompleted = 0;
        this.pomodoroEstimated = 1;
        this.otraCategoria="";
    }
}
