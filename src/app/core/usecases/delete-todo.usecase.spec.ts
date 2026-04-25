import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TodoRepository } from '../domain/repositories/todo.repository';
import { DeleteTodoUseCase } from './delete-todo.usecase';

const mockRepository: Partial<TodoRepository> = {
  delete: jasmine.createSpy('delete').and.returnValue(of(void 0)),
};

describe('DeleteTodoUseCase', () => {
  let useCase: DeleteTodoUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeleteTodoUseCase,
        { provide: TodoRepository, useValue: mockRepository },
      ],
    });
    useCase = TestBed.inject(DeleteTodoUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should delete a todo by id', (done) => {
    useCase.execute('1').subscribe(() => {
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      done();
    });
  });
});
