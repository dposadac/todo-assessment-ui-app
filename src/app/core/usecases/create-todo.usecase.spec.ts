import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from '../domain/entities/todo.entity';
import { TodoRepository } from '../domain/repositories/todo.repository';
import { CreateTodoUseCase } from './create-todo.usecase';

const mockTodo: Todo = {
  id: '1',
  title: 'New todo',
  completed: false,
  createdAt: new Date(),
};

const mockRepository: Partial<TodoRepository> = {
  create: jasmine.createSpy('create').and.returnValue(of(mockTodo)),
};

describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateTodoUseCase,
        { provide: TodoRepository, useValue: mockRepository },
      ],
    });
    useCase = TestBed.inject(CreateTodoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should create a todo with given title', (done) => {
    useCase.execute('New todo').subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
      expect(mockRepository.create).toHaveBeenCalledWith('New todo');
      done();
    });
  });
});
