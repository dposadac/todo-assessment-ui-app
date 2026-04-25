import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from '../domain/entities/todo.entity';
import { TodoRepository } from '../domain/repositories/todo.repository';
import { GetTodosUseCase } from './get-todos.usecase';

const mockTodos: Todo[] = [
  { id: '1', title: 'Test todo', completed: false, createdAt: new Date() },
];

const mockRepository: Partial<TodoRepository> = {
  getAll: jasmine.createSpy('getAll').and.returnValue(of(mockTodos)),
};

describe('GetTodosUseCase', () => {
  let useCase: GetTodosUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GetTodosUseCase,
        { provide: TodoRepository, useValue: mockRepository },
      ],
    });
    useCase = TestBed.inject(GetTodosUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return all todos from repository', (done) => {
    useCase.execute().subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
      expect(mockRepository.getAll).toHaveBeenCalled();
      done();
    });
  });
});
