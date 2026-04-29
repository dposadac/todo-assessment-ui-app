import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Todo } from '../../../core/domain/entities/todo.entity';
import { TodoItemComponent } from './todo-item.component';

const mockTodo: Todo = {
  id: '1',
  title: 'Test todo item',
  category: 'A',
  status: 'Pendiente',
  createdAt: new Date(),
};

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = { ...mockTodo };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render todo title in card', () => {
    const card = fixture.nativeElement.querySelector('.task-card');
    expect(card.textContent).toContain('Test todo item');
  });

  it('should render category in card', () => {
    const card = fixture.nativeElement.querySelector('.task-card');
    expect(card.textContent).toContain('A');
  });

  it('should render estado in card', () => {
    const card = fixture.nativeElement.querySelector('.task-card');
    expect(card.textContent).toContain('Pendiente');
  });

  it('should not emit toggle when current status is already Completado', () => {
    component.todo = { ...mockTodo, status: 'Completado' };
    const toggleSpy = jasmine.createSpy('toggle');
    component.toggle.subscribe(toggleSpy);

    component.onToggle();

    expect(toggleSpy).not.toHaveBeenCalled();
  });

  it('should not emit via onCambiar when status is already Completado', () => {
    component.todo = { ...mockTodo, status: 'Completado' };
    component.localStatus = 'Pendiente';
    const toggleSpy = jasmine.createSpy('toggle');
    component.toggle.subscribe(toggleSpy);

    component.onCambiar();

    expect(toggleSpy).not.toHaveBeenCalled();
  });

  it('should emit deleteTodo with todo id', () => {
    const deleteSpy = jasmine.createSpy('deleteTodo');
    component.deleteTodo.subscribe(deleteSpy);

    component.onDelete();

    expect(deleteSpy).toHaveBeenCalledWith('1');
  });

  it('should apply completed class when status is Completado', () => {
    component.todo = { ...mockTodo, status: 'Completado' };
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('.task-row');
    expect(row.classList.contains('completed')).toBeTrue();
  });

  it('should not apply completed class when status is Pendiente', () => {
    component.todo = { ...mockTodo, status: 'Pendiente' };
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('.task-row');
    expect(row.classList.contains('completed')).toBeFalse();
  });
});
