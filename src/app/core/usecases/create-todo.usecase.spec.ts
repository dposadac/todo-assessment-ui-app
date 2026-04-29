import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from '../domain/entities/todo.entity';
import { TodoRepository } from '../domain/repositories/todo.repository';
import { CreateTodoUseCase } from './create-todo.usecase';

const mockTodo: Todo = {
  id: '1',
  title: 'New todo',
  category: 'A',
  status: 'Pendiente',
  createdAt: new Date(),
};

const mockRepository: Partial<TodoRepository> = {
  create: jasmine.createSpy('create').and.returnValue(of(mockTodo)),
};

describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateTodoUseCase, { provide: TodoRepository, useValue: mockRepository }],
    });
    useCase = TestBed.inject(CreateTodoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should create a todo with given title, category and status', (done) => {
    useCase.execute('New todo', 'A', 'Pendiente').subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
      expect(mockRepository.create).toHaveBeenCalledWith('New todo', 'A', 'Pendiente');
      done();
    });
  });
});
