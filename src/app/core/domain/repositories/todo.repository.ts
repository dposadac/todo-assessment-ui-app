import { Observable } from 'rxjs';
import { Todo, TodoCategory, TodoStatus } from '../entities/todo.entity';

export abstract class TodoRepository {
  abstract getAll(): Observable<Todo[]>;
  abstract create(title: string, category: TodoCategory, status: TodoStatus): Observable<Todo>;
  abstract update(todo: Todo): Observable<Todo>;
  abstract delete(id: string): Observable<void>;
}
