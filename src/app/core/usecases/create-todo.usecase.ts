import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo, TodoCategory, TodoStatus } from '../domain/entities/todo.entity';
import { TodoRepository } from '../domain/repositories/todo.repository';

@Injectable({ providedIn: 'root' })
export class CreateTodoUseCase {
  private readonly repository = inject(TodoRepository);

  execute(title: string, category: TodoCategory, status: TodoStatus): Observable<Todo> {
    return this.repository.create(title, category, status);
  }
}
