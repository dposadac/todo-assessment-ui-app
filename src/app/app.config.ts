import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';
import { RemoteConfigService } from './core/services/remote-config.service';
import { TodoRepository } from './core/domain/repositories/todo.repository';
import { FirestoreTodoRepository } from './data/repositories/firestore-todo.repository';

function initRemoteConfig(rcService: RemoteConfigService): () => Promise<void> {
  return () => rcService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIonicAngular({ mode: 'md' }),
    { provide: TodoRepository, useClass: FirestoreTodoRepository },
    {
      provide: APP_INITIALIZER,
      useFactory: initRemoteConfig,
      deps: [RemoteConfigService],
      multi: true,
    },
  ],
};
