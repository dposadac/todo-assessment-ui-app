import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../domain/entities/todo.entity';
import { TodoRepository } from '../domain/repositories/todo.repository';

@Injectable({ providedIn: 'root' })
export class CreateTodoUseCase {
  private readonly repository = inject(TodoRepository);

  execute(title: string): Observable<Todo> {
    return this.repository.create(title);
  }
}
