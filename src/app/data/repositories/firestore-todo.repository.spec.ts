import { TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { Todo } from '../../core/domain/entities/todo.entity';
import { FirestoreTodoRepository } from './firestore-todo.repository';

const mockTodo: Todo = {
  id: 'doc1',
  title: 'Test task',
  category: 'Personal',
  status: 'Pendiente',
  createdAt: new Date('2024-01-01'),
};

describe('FirestoreTodoRepository', () => {
  let repository: FirestoreTodoRepository;
  let snapshotSubject: Subject<Todo[]>;

  const firestoreStub = {
    getAll: jasmine.createSpy('getAll'),
    create: jasmine.createSpy('create'),
    update: jasmine.createSpy('update'),
    delete: jasmine.createSpy('delete'),
  };

  beforeEach(() => {
    snapshotSubject = new Subject<Todo[]>();

    firestoreStub.getAll.and.returnValue(snapshotSubject.asObservable());
    firestoreStub.create.and.returnValue(of(mockTodo));
    firestoreStub.update.and.returnValue(of(mockTodo));
    firestoreStub.delete.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      providers: [
        { provide: FirestoreTodoRepository, useValue: firestoreStub },
      ],
    });

    repository = TestBed.inject(FirestoreTodoRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should emit todos in real-time via getAll()', (done) => {
    const todos = [mockTodo];
    repository.getAll().subscribe((result) => {
      expect(result).toEqual(todos);
      done();
    });
    snapshotSubject.next(todos);
  });

  it('should emit updated todos when Firestore changes', (done) => {
    const emissions: Todo[][] = [];
    repository.getAll().subscribe((result) => {
      emissions.push(result);
      if (emissions.length === 2) {
        expect(emissions[0].length).toBe(1);
        expect(emissions[1].length).toBe(2);
        done();
      }
    });

    snapshotSubject.next([mockTodo]);
    snapshotSubject.next([mockTodo, { ...mockTodo, id: 'doc2', title: 'Second' }]);
  });

  it('should create a todo and return it', (done) => {
    repository.create('Test task', 'Personal', 'Pendiente').subscribe((todo) => {
      expect(todo.title).toBe(mockTodo.title);
      expect(todo.category).toBe(mockTodo.category);
      expect(todo.status).toBe(mockTodo.status);
      done();
    });
  });

  it('should update a todo and return it', (done) => {
    const updated = { ...mockTodo, status: 'Completado' as const };
    firestoreStub.update.and.returnValue(of(updated));
    repository.update(updated).subscribe((todo) => {
      expect(todo.status).toBe('Completado');
      done();
    });
  });

  it('should delete a todo by id', (done) => {
    repository.delete('doc1').subscribe(() => {
      expect(firestoreStub.delete).toHaveBeenCalledWith('doc1');
      done();
    });
  });
});
