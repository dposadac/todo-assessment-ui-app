import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCheckbox, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Todo, TodoStatus } from '../../../core/domain/entities/todo.entity';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule, IonCheckbox, IonSelect, IonSelectOption, IonButton],
  template: `
    <div class="task-row" [class.completed]="todo.status === 'Completado'">
      <ion-checkbox
        [checked]="todo.status === 'Completado'"
        [disabled]="todo.status === 'Completado'"
        (ionChange)="onToggle()"
        aria-label="Toggle todo"
      />
      <div class="task-card">
        <p>Nombre: {{ todo.title }}</p>
        <p>Categoria: {{ todo.category }}</p>
        <div class="status-row">
          <span>Estado</span>
          <ion-select
            [(ngModel)]="localStatus"
            [disabled]="todo.status === 'Completado'"
            (ionChange)="onStatusChange()"
            interface="popover"
            class="status-select"
            aria-label="Estado"
          >
            <ion-select-option value="Pendiente">Pendiente</ion-select-option>
            <ion-select-option value="Completado">Completado</ion-select-option>
          </ion-select>
          <ion-button size="small" [disabled]="todo.status === 'Completado'" (click)="onCambiar()"
            >Cambiar</ion-button
          >
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .task-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }
      .task-card {
        flex: 1;
        border: 1.5px solid #bbb;
        border-radius: 14px;
        padding: 12px 16px;
        background: #fff;
      }
      .task-card p {
        margin: 3px 0;
        font-size: 14px;
        color: #222;
      }
      .completed .task-card {
        opacity: 0.55;
      }
      .status-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
      }
      .status-row span {
        font-size: 14px;
        color: #222;
        white-space: nowrap;
      }
      .status-select {
        border: 1px solid #bbb;
        border-radius: 4px;
      }
    `,
  ],
})
export class TodoItemComponent implements OnInit, OnChanges {
  @Input({ required: true }) todo!: Todo;
  @Output() toggle = new EventEmitter<Todo>();
  @Output() deleteTodo = new EventEmitter<string>();
  @Output() statusSelected = new EventEmitter<{ id: string; status: TodoStatus }>();

  localStatus: TodoStatus = 'Pendiente';

  ngOnInit(): void {
    this.localStatus = this.todo.status;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && !changes['todo'].firstChange) {
      this.localStatus = this.todo.status;
    }
  }

  onToggle(): void {
    if (this.todo.status === 'Completado') return;
    this.localStatus = 'Completado';
    this.statusSelected.emit({ id: this.todo.id, status: this.localStatus });
  }

  onCambiar(): void {
    if (this.todo.status === 'Completado') return;
    this.toggle.emit({ ...this.todo, status: this.localStatus });
  }

  onStatusChange(): void {
    this.statusSelected.emit({ id: this.todo.id, status: this.localStatus });
  }

  onDelete(): void {
    this.deleteTodo.emit(this.todo.id);
  }
}
