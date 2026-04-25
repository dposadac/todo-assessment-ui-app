import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Todo } from '../domain/entities/todo.entity';
import { TodoRepository } from '../domain/repositories/todo.repository';
import { UpdateTodoUseCase } from './update-todo.usecase';

const mockTodo: Todo = {
  id: '1',
  title: 'Updated todo',
  completed: true,
  createdAt: new Date(),
};

const mockRepository: Partial<TodoRepository> = {
  update: jasmine.createSpy('update').and.returnValue(of(mockTodo)),
};

describe('UpdateTodoUseCase', () => {
  let useCase: UpdateTodoUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UpdateTodoUseCase,
        { provide: TodoRepository, useValue: mockRepository },
      ],
    });
    useCase = TestBed.inject(UpdateTodoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should update a todo via repository', (done) => {
    useCase.execute(mockTodo).subscribe((todo) => {
      expect(todo).toEqual(mockTodo);
      expect(mockRepository.update).toHaveBeenCalledWith(mockTodo);
      done();
    });
  });
});
