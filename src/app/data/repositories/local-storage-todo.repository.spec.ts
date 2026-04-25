import { TestBed } from '@angular/core/testing';
import { LocalStorageTodoRepository } from './local-storage-todo.repository';

describe('LocalStorageTodoRepository', () => {
  let repository: LocalStorageTodoRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LocalStorageTodoRepository] });
    repository = TestBed.inject(LocalStorageTodoRepository);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should return empty array when no todos stored', (done) => {
    repository.getAll().subscribe((todos) => {
      expect(todos).toEqual([]);
      done();
    });
  });

  it('should create and persist a todo', (done) => {
    repository.create('Buy milk').subscribe((todo) => {
      expect(todo.title).toBe('Buy milk');
      expect(todo.completed).toBeFalse();
      expect(todo.id).toBeTruthy();

      repository.getAll().subscribe((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].title).toBe('Buy milk');
        done();
      });
    });
  });

  it('should update an existing todo', (done) => {
    repository.create('Original').subscribe((created) => {
      const updated = { ...created, title: 'Updated', completed: true };

      repository.update(updated).subscribe((result) => {
        expect(result.title).toBe('Updated');
        expect(result.completed).toBeTrue();

        repository.getAll().subscribe((todos) => {
          expect(todos[0].title).toBe('Updated');
          done();
        });
      });
    });
  });

  it('should delete a todo by id', (done) => {
    repository.create('To delete').subscribe((created) => {
      repository.delete(created.id).subscribe(() => {
        repository.getAll().subscribe((todos) => {
          expect(todos.length).toBe(0);
          done();
        });
      });
    });
  });

  it('should not affect other todos when deleting one', (done) => {
    repository.create('Keep me').subscribe(() => {
      repository.create('Delete me').subscribe((second) => {
        repository.delete(second.id).subscribe(() => {
          repository.getAll().subscribe((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].title).toBe('Keep me');
            done();
          });
        });
      });
    });
  });
});
