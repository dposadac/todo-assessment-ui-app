import { Injectable } from '@angular/core';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Todo, TodoCategory, TodoStatus } from '../../core/domain/entities/todo.entity';
import { TodoRepository } from '../../core/domain/repositories/todo.repository';
import { getFirebaseApp } from '../firebase/firebase.config';

const COLLECTION = 'todos';

@Injectable({ providedIn: 'root' })
export class FirestoreTodoRepository extends TodoRepository {
  private readonly db = getFirestore(getFirebaseApp());
  private readonly todosRef = collection(this.db, COLLECTION);

  override getAll(): Observable<Todo[]> {
    return new Observable((observer) => {
      const q = query(this.todosRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const todos: Todo[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              title: data['title'] as string,
              category: data['category'] as TodoCategory,
              status: data['status'] as TodoStatus,
              createdAt: (data['createdAt'] as Timestamp).toDate(),
            };
          });
          observer.next(todos);
        },
        (error) => observer.error(error),
      );
      return () => unsubscribe();
    });
  }

  override create(title: string, category: TodoCategory, status: TodoStatus): Observable<Todo> {
    return new Observable((observer) => {
      const payload = {
        title,
        category,
        status,
        createdAt: Timestamp.now(),
      };
      addDoc(this.todosRef, payload)
        .then((ref) => {
          observer.next({ id: ref.id, title, category, status, createdAt: payload.createdAt.toDate() });
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  override update(todo: Todo): Observable<Todo> {
    return new Observable((observer) => {
      const { id, createdAt, ...data } = todo;
      updateDoc(doc(this.db, COLLECTION, id), {
        ...data,
        createdAt: Timestamp.fromDate(createdAt),
      })
        .then(() => {
          observer.next(todo);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  override delete(id: string): Observable<void> {
    return new Observable((observer) => {
      deleteDoc(doc(this.db, COLLECTION, id))
        .then(() => {
          observer.next(void 0);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }
}
