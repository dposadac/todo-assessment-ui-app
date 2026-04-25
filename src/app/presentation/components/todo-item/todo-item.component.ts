import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Todo } from '../../../core/domain/entities/todo.entity';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [IonItem, IonLabel, IonCheckbox, IonIcon],
  template: `
    <ion-item [class.completed]="todo.completed">
      <ion-checkbox
        slot="start"
        [checked]="todo.completed"
        (ionChange)="onToggle()"
        aria-label="Toggle todo"
      />
      <ion-label>{{ todo.title }}</ion-label>
      <ion-icon
        slot="end"
        name="trash-outline"
        (click)="onDelete()"
        aria-label="Delete todo"
      />
    </ion-item>
  `,
  styles: [
    `
      .completed ion-label {
        text-decoration: line-through;
        opacity: 0.5;
      }
      ion-icon {
        cursor: pointer;
        color: var(--ion-color-danger);
      }
    `,
  ],
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();

  onToggle(): void {
    this.toggle.emit({ ...this.todo, completed: !this.todo.completed });
  }

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }
}
