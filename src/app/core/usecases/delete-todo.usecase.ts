import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoRepository } from '../domain/repositories/todo.repository';

@Injectable({ providedIn: 'root' })
export class DeleteTodoUseCase {
  private readonly repository = inject(TodoRepository);

  execute(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
