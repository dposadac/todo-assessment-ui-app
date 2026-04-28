import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TodoStatus } from '../../../core/domain/entities/todo.entity';
import { CreateTodoUseCase } from '../../../core/usecases/create-todo.usecase';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>NUEVA TAREA</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="form-container">
        <ion-label>Nombre</ion-label>
        <ion-input
          [(ngModel)]="title"
          placeholder="Ingresa el nombre"
          fill="outline"
          class="form-field"
          aria-label="Nombre de la tarea"
        />

        <ion-label>Categoria</ion-label>
        <ion-input
          [(ngModel)]="category"
          placeholder="Ingresa la categoría"
          fill="outline"
          class="form-field"
          aria-label="Categoria"
        />

        <ion-label>Estado</ion-label>
        <ion-select
          [(ngModel)]="status"
          interface="popover"
          fill="outline"
          class="form-field"
          aria-label="Estado"
        >
          @for (s of statuses; track s) {
            <ion-select-option [value]="s">{{ s }}</ion-select-option>
          }
        </ion-select>

        <div class="button-row">
          <ion-button expand="block" shape="round" (click)="onBack()">
            Atras
          </ion-button>
          <ion-button
            expand="block"
            shape="round"
            (click)="onSave()"
            [disabled]="!title.trim() || !category.trim()"
          >
            Guardar
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .form-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px 0;
      }
      .form-field {
        margin-bottom: 8px;
      }
      .button-row {
        display: flex;
        gap: 16px;
        margin-top: 24px;
      }
      .button-row ion-button {
        flex: 1;
      }
    `,
  ],
})
export class NewTaskPage {
  private readonly createTodo = inject(CreateTodoUseCase);
  private readonly router = inject(Router);

  title = '';
  category = '';
  status: TodoStatus = 'Pendiente';

  readonly statuses: TodoStatus[] = ['Pendiente', 'Completado'];

  onBack(): void {
    this.router.navigateByUrl('/todos');
  }

  onSave(): void {
    const trimmed = this.title.trim();
    const trimmedCategory = this.category.trim();
    if (!trimmed || !trimmedCategory) return;
    this.createTodo.execute(trimmed, trimmedCategory, this.status).subscribe(() => {
      this.router.navigateByUrl('/todos');
    });
  }
}
