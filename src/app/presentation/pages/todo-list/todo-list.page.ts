import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { inject } from '@angular/core';
import { Todo } from '../../../core/domain/entities/todo.entity';
import { CreateTodoUseCase } from '../../../core/usecases/create-todo.usecase';
import { DeleteTodoUseCase } from '../../../core/usecases/delete-todo.usecase';
import { GetTodosUseCase } from '../../../core/usecases/get-todos.usecase';
import { UpdateTodoUseCase } from '../../../core/usecases/update-todo.usecase';
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonFooter,
    IonInput,
    IonButton,
    TodoItemComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>My Todos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        @for (todo of todos(); track todo.id) {
          <app-todo-item
            [todo]="todo"
            (toggle)="onToggle($event)"
            (delete)="onDelete($event)"
          />
        } @empty {
          <p class="empty-state">No tasks yet. Add one below!</p>
        }
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-input
          [(ngModel)]="newTitle"
          placeholder="New task..."
          (keyup.enter)="onAdd()"
          aria-label="New task input"
        />
        <ion-button slot="end" (click)="onAdd()" [disabled]="!newTitle.trim()">
          Add
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [
    `
      .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--ion-color-medium);
      }
      ion-footer ion-toolbar {
        display: flex;
        align-items: center;
        padding: 0 8px;
      }
    `,
  ],
})
export class TodoListPage implements OnInit {
  private readonly getTodos = inject(GetTodosUseCase);
  private readonly createTodo = inject(CreateTodoUseCase);
  private readonly updateTodo = inject(UpdateTodoUseCase);
  private readonly deleteTodo = inject(DeleteTodoUseCase);

  todos = signal<Todo[]>([]);
  newTitle = '';

  ngOnInit(): void {
    this.loadTodos();
  }

  onAdd(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    this.createTodo.execute(title).subscribe((todo) => {
      this.todos.update((current) => [...current, todo]);
      this.newTitle = '';
    });
  }

  onToggle(updated: Todo): void {
    this.updateTodo.execute(updated).subscribe((todo) => {
      this.todos.update((current) =>
        current.map((t) => (t.id === todo.id ? todo : t))
      );
    });
  }

  onDelete(id: string): void {
    this.deleteTodo.execute(id).subscribe(() => {
      this.todos.update((current) => current.filter((t) => t.id !== id));
    });
  }

  private loadTodos(): void {
    this.getTodos.execute().subscribe((todos) => this.todos.set(todos));
  }
}
