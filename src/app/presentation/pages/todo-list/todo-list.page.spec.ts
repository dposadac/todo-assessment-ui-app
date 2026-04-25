import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../../core/domain/entities/todo.entity';
import { CreateTodoUseCase } from '../../../core/usecases/create-todo.usecase';
import { DeleteTodoUseCase } from '../../../core/usecases/delete-todo.usecase';
import { GetTodosUseCase } from '../../../core/usecases/get-todos.usecase';
import { UpdateTodoUseCase } from '../../../core/usecases/update-todo.usecase';
import { TodoListPage } from './todo-list.page';

const mockTodos: Todo[] = [
  { id: '1', title: 'First todo', completed: false, createdAt: new Date() },
  { id: '2', title: 'Second todo', completed: true, createdAt: new Date() },
];

const newTodo: Todo = {
  id: '3',
  title: 'New todo',
  completed: false,
  createdAt: new Date(),
};

describe('TodoListPage', () => {
  let component: TodoListPage;
  let fixture: ComponentFixture<TodoListPage>;

  const getTodosUseCase = { execute: jasmine.createSpy('execute').and.returnValue(of(mockTodos)) };
  const createTodoUseCase = { execute: jasmine.createSpy('execute').and.returnValue(of(newTodo)) };
  const updateTodoUseCase = { execute: jasmine.createSpy('execute').and.callFake((t: Todo) => of(t)) };
  const deleteTodoUseCase = { execute: jasmine.createSpy('execute').and.returnValue(of(void 0)) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListPage, IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: GetTodosUseCase, useValue: getTodosUseCase },
        { provide: CreateTodoUseCase, useValue: createTodoUseCase },
        { provide: UpdateTodoUseCase, useValue: updateTodoUseCase },
        { provide: DeleteTodoUseCase, useValue: deleteTodoUseCase },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    expect(getTodosUseCase.execute).toHaveBeenCalled();
    expect(component.todos().length).toBe(2);
  });

  it('should add a new todo', () => {
    component.newTitle = 'New todo';
    component.onAdd();

    expect(createTodoUseCase.execute).toHaveBeenCalledWith('New todo');
    expect(component.todos().length).toBe(3);
    expect(component.newTitle).toBe('');
  });

  it('should not add todo when title is empty or whitespace', () => {
    const initialCount = component.todos().length;
    createTodoUseCase.execute.calls.reset();

    component.newTitle = '   ';
    component.onAdd();

    expect(createTodoUseCase.execute).not.toHaveBeenCalled();
    expect(component.todos().length).toBe(initialCount);
  });

  it('should toggle a todo completed state', () => {
    const updatedTodo = { ...mockTodos[0], completed: true };
    component.onToggle(updatedTodo);

    expect(updateTodoUseCase.execute).toHaveBeenCalledWith(updatedTodo);
    const found = component.todos().find((t) => t.id === '1');
    expect(found?.completed).toBeTrue();
  });

  it('should delete a todo by id', () => {
    component.onDelete('1');

    expect(deleteTodoUseCase.execute).toHaveBeenCalledWith('1');
    expect(component.todos().find((t) => t.id === '1')).toBeUndefined();
  });

  it('should render the page header', () => {
    const title = fixture.nativeElement.querySelector('ion-title');
    expect(title.textContent.trim()).toBe('My Todos');
  });
});
