import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { add, search } from 'ionicons/icons';
import { Todo, TodoStatus } from '../../../core/domain/entities/todo.entity';
import { RemoteConfigService } from '../../../core/services/remote-config.service';
import { DeleteTodoUseCase } from '../../../core/usecases/delete-todo.usecase';
import { GetTodosUseCase } from '../../../core/usecases/get-todos.usecase';
import { UpdateTodoUseCase } from '../../../core/usecases/update-todo.usecase';
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';

const FILTER_KEY = 'todoListFilter';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    TodoItemComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button color="light" />
        </ion-buttons>
        <ion-title>LISTA TAREAS</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="filter-row">
        <div class="select-wrapper">
          <p class="filter-label">Categoria</p>
          <ion-select
            [(ngModel)]="selectedCategory"
            (ngModelChange)="onSearch()"
            placeholder="Todas"
            interface="popover"
            class="category-select"
          >
            <ion-select-option value="">Todas</ion-select-option>
            @for (cat of allCategories(); track cat) {
              <ion-select-option [value]="cat">{{ cat }}</ion-select-option>
            }
          </ion-select>
        </div>
        <ion-button shape="round" (click)="onSearch()" aria-label="Buscar">
          <ion-icon slot="icon-only" name="search" />
        </ion-button>
        <ion-button shape="round" (click)="onNavigateToNew()" aria-label="Nueva tarea">
          <ion-icon slot="icon-only" name="add" />
        </ion-button>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <ion-spinner name="crescent" />
          <p class="loading-text">Cargando tareas...</p>
        </div>
      } @else {
        <ion-list lines="none">
          @for (todo of filteredTodos(); track todo.id) {
            <app-todo-item
              [todo]="todo"
              (toggle)="onToggle($event)"
              (deleteTodo)="onDelete($event)"
              (statusSelected)="onStatusSelected($event)"
            />
          } @empty {
            <p class="empty-state">No hay tareas. ¡Crea una nueva!</p>
          }
        </ion-list>

        <div class="footer-actions">
          <ion-button expand="block" shape="round" (click)="onActualizarTodos()">
            Actualizar todos
          </ion-button>
        </div>
      }
    </ion-content>
  `,
  styles: [
    `
      .filter-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        margin-bottom: 16px;
      }
      .select-wrapper {
        flex: 1;
      }
      .filter-label {
        font-size: 14px;
        margin: 0 0 4px 0;
        color: var(--ion-color-dark);
      }
      .category-select {
        border: 1px solid var(--ion-color-medium);
        border-radius: 4px;
        padding: 4px 8px;
        width: 100%;
      }
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 0;
        gap: 12px;
      }
      .loading-text {
        color: var(--ion-color-medium);
        font-size: 14px;
        margin: 0;
      }
      .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--ion-color-medium);
      }
      .footer-actions {
        margin-top: 24px;
      }
    `,
  ],
})
export class TodoListPage implements OnInit, OnDestroy {
  private readonly getTodos = inject(GetTodosUseCase);
  private readonly updateTodo = inject(UpdateTodoUseCase);
  private readonly deleteTodo = inject(DeleteTodoUseCase);
  private readonly remoteConfig = inject(RemoteConfigService);
  private readonly router = inject(Router);

  todos = signal<Todo[]>([]);
  isLoading = signal(true);
  selectedCategory = '';
  activeFilter = signal<string>('');

  private readonly pendingStatuses = new Map<string, TodoStatus>();
  private todosSubscription: Subscription | null = null;

  readonly categories = computed(() => {
    const cats = this.todos()
      .map((t) => t.category)
      .filter(Boolean);
    return [...new Set(cats)].sort();
  });

  readonly allCategories = computed(() => {
    const fromTodos = this.categories();
    const fromRemote = this.remoteConfig.categories();
    return [...new Set([...fromRemote, ...fromTodos])].sort();
  });

  filteredTodos = computed(() => {
    const filter = this.activeFilter();
    if (!filter) return this.todos();
    return this.todos().filter((t) => t.category === filter);
  });

  constructor() {
    addIcons({ search, add });
  }

  ngOnInit(): void {
    const saved = sessionStorage.getItem(FILTER_KEY);
    if (saved !== null) {
      this.selectedCategory = saved;
      this.activeFilter.set(saved);
    }
    this.loadTodos();
  }

  ngOnDestroy(): void {
    this.todosSubscription?.unsubscribe();
  }

  onSearch(): void {
    this.activeFilter.set(this.selectedCategory);
  }

  onNavigateToNew(): void {
    sessionStorage.setItem(FILTER_KEY, this.selectedCategory);
    this.router.navigateByUrl('/todos/new');
  }

  onToggle(updated: Todo): void {
    this.updateTodo.execute(updated).subscribe((todo) => {
      this.todos.update((current) => current.map((t) => (t.id === todo.id ? todo : t)));
    });
  }

  onDelete(id: string): void {
    this.deleteTodo.execute(id).subscribe(() => {
      this.todos.update((current) => current.filter((t) => t.id !== id));
    });
  }

  onStatusSelected(event: { id: string; status: TodoStatus }): void {
    this.pendingStatuses.set(event.id, event.status);
  }

  onActualizarTodos(): void {
    this.filteredTodos().forEach((todo) => {
      const newStatus = this.pendingStatuses.get(todo.id) ?? todo.status;
      if (newStatus !== todo.status) {
        this.onToggle({ ...todo, status: newStatus });
      }
    });
    this.pendingStatuses.clear();
  }

  private loadTodos(): void {
    this.isLoading.set(true);
    let firstEmission = true;
    this.todosSubscription = this.getTodos.execute().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        if (firstEmission) {
          this.isLoading.set(false);
          firstEmission = false;
        }
      },
      error: () => this.isLoading.set(false),
    });
  }
}
