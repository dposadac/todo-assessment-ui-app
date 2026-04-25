import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Todo } from '../../../core/domain/entities/todo.entity';
import { TodoItemComponent } from './todo-item.component';

const mockTodo: Todo = {
  id: '1',
  title: 'Test todo item',
  completed: false,
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

  it('should render todo title', () => {
    const label = fixture.nativeElement.querySelector('ion-label');
    expect(label.textContent.trim()).toBe('Test todo item');
  });

  it('should emit toggle with inverted completed state', () => {
    const toggleSpy = jasmine.createSpy('toggle');
    component.toggle.subscribe(toggleSpy);

    component.onToggle();

    expect(toggleSpy).toHaveBeenCalledWith({ ...mockTodo, completed: true });
  });

  it('should emit delete with todo id', () => {
    const deleteSpy = jasmine.createSpy('delete');
    component.delete.subscribe(deleteSpy);

    component.onDelete();

    expect(deleteSpy).toHaveBeenCalledWith('1');
  });

  it('should apply completed class when todo is completed', () => {
    component.todo = { ...mockTodo, completed: true };
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('ion-item');
    expect(item.classList.contains('completed')).toBeTrue();
  });

  it('should not apply completed class when todo is not completed', () => {
    component.todo = { ...mockTodo, completed: false };
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('ion-item');
    expect(item.classList.contains('completed')).toBeFalse();
  });
});
