import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../../core/domain/entities/todo.entity';
import { DeleteTodoUseCase } from '../../../core/usecases/delete-todo.usecase';
import { GetTodosUseCase } from '../../../core/usecases/get-todos.usecase';
import { UpdateTodoUseCase } from '../../../core/usecases/update-todo.usecase';
import { TodoListPage } from './todo-list.page';

const mockTodos: Todo[] = [
  { id: '1', title: 'First todo', category: 'A', status: 'Pendiente', createdAt: new Date() },
  { id: '2', title: 'Second todo', category: 'B', status: 'Completado', createdAt: new Date() },
];

describe('TodoListPage', () => {
  let component: TodoListPage;
  let fixture: ComponentFixture<TodoListPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  const getTodosUseCase = { execute: jasmine.createSpy('execute').and.returnValue(of(mockTodos)) };
  const updateTodoUseCase = { execute: jasmine.createSpy('execute').and.callFake((t: Todo) => of(t)) };
  const deleteTodoUseCase = { execute: jasmine.createSpy('execute').and.returnValue(of(void 0)) };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [TodoListPage, IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: GetTodosUseCase, useValue: getTodosUseCase },
        { provide: UpdateTodoUseCase, useValue: updateTodoUseCase },
        { provide: DeleteTodoUseCase, useValue: deleteTodoUseCase },
        { provide: Router, useValue: routerSpy },
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

  it('should show all todos when no category filter is active', () => {
    expect(component.filteredTodos().length).toBe(2);
  });

  it('should derive categories dynamically from loaded todos', () => {
    expect(component.categories()).toEqual(['A', 'B']);
  });

  it('should filter todos by category when search is activated', () => {
    component.selectedCategory = 'A';
    component.onSearch();

    expect(component.filteredTodos().length).toBe(1);
    expect(component.filteredTodos()[0].category).toBe('A');
  });

  it('should show all todos when filter is cleared', () => {
    component.selectedCategory = 'A';
    component.onSearch();
    component.selectedCategory = '';
    component.onSearch();

    expect(component.filteredTodos().length).toBe(2);
  });

  it('should toggle a todo status', () => {
    const updatedTodo = { ...mockTodos[0], status: 'Completado' as const };
    component.onToggle(updatedTodo);

    expect(updateTodoUseCase.execute).toHaveBeenCalledWith(updatedTodo);
    const found = component.todos().find((t) => t.id === '1');
    expect(found?.status).toBe('Completado');
  });

  it('should delete a todo by id', () => {
    component.onDelete('1');

    expect(deleteTodoUseCase.execute).toHaveBeenCalledWith('1');
    expect(component.todos().find((t) => t.id === '1')).toBeUndefined();
  });

  it('should navigate to new task page', () => {
    component.onNavigateToNew();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/todos/new');
  });

  it('should render LISTA TAREAS in header', () => {
    const title = fixture.nativeElement.querySelector('ion-title');
    expect(title.textContent.trim()).toBe('LISTA TAREAS');
  });

  it('should dynamically add new category to filter options when a todo with a new category is added', () => {
    const newTodo: Todo = { id: '3', title: 'Third', category: 'C', status: 'Pendiente', createdAt: new Date() };
    component.todos.update((current) => [...current, newTodo]);
    expect(component.categories()).toEqual(['A', 'B', 'C']);
  });

  it('should save selected category to sessionStorage before navigating to new task', () => {
    component.selectedCategory = 'B';
    component.onNavigateToNew();
    expect(sessionStorage.getItem('todoListFilter')).toBe('B');
  });

  it('should restore category filter from sessionStorage on init', () => {
    sessionStorage.setItem('todoListFilter', 'A');
    getTodosUseCase.execute.and.returnValue(of(mockTodos));
    component.ngOnInit();
    expect(component.selectedCategory).toBe('A');
    expect(component.activeFilter()).toBe('A');
  });

  it('should show all todos when Todas option is selected after a filter was active', () => {
    component.selectedCategory = 'A';
    component.onSearch();
    expect(component.filteredTodos().length).toBe(1);

    component.selectedCategory = '';
    component.onSearch();
    expect(component.filteredTodos().length).toBe(2);
  });
});
