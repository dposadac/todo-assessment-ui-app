import { Observable } from 'rxjs';
import { Todo } from '../entities/todo.entity';

export abstract class TodoRepository {
  abstract getAll(): Observable<Todo[]>;
  abstract create(title: string): Observable<Todo>;
  abstract update(todo: Todo): Observable<Todo>;
  abstract delete(id: string): Observable<void>;
}
