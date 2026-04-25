import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../../core/domain/entities/todo.entity';
import { TodoRepository } from '../../core/domain/repositories/todo.repository';

const STORAGE_KEY = 'todos';

@Injectable({ providedIn: 'root' })
export class LocalStorageTodoRepository extends TodoRepository {
  private load(): Todo[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as Todo[]).map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  }

  private save(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  override getAll(): Observable<Todo[]> {
    return of(this.load());
  }

  override create(title: string): Observable<Todo> {
    const todos = this.load();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    this.save([...todos, newTodo]);
    return of(newTodo);
  }

  override update(todo: Todo): Observable<Todo> {
    const todos = this.load().map((t) => (t.id === todo.id ? todo : t));
    this.save(todos);
    return of(todo);
  }

  override delete(id: string): Observable<void> {
    this.save(this.load().filter((t) => t.id !== id));
    return of(void 0);
  }
}
