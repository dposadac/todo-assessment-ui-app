import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';
import { TodoRepository } from './core/domain/repositories/todo.repository';
import { LocalStorageTodoRepository } from './data/repositories/local-storage-todo.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular({ mode: 'md' }),
    { provide: TodoRepository, useClass: LocalStorageTodoRepository },
  ],
};
