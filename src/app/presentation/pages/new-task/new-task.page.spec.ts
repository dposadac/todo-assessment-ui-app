import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../../core/domain/entities/todo.entity';
import { RemoteConfigService } from '../../../core/services/remote-config.service';
import { CreateTodoUseCase } from '../../../core/usecases/create-todo.usecase';
import { NewTaskPage } from './new-task.page';

const savedTodo: Todo = {
  id: '1',
  title: 'Nueva tarea',
  category: 'Personal',
  status: 'Pendiente',
  createdAt: new Date(),
};

describe('NewTaskPage', () => {
  let component: NewTaskPage;
  let fixture: ComponentFixture<NewTaskPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  const createTodoUseCase = {
    execute: jasmine.createSpy('execute').and.returnValue(of(savedTodo)),
  };

  const remoteConfigStub = {
    categories: signal(['Personal', 'Trabajo', 'Compras', 'Salud', 'Estudio']),
    initialize: jasmine.createSpy('initialize').and.returnValue(Promise.resolve()),
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [NewTaskPage, IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: CreateTodoUseCase, useValue: createTodoUseCase },
        { provide: RemoteConfigService, useValue: remoteConfigStub },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.title).toBe('');
    expect(component.category).toBe('');
    expect(component.status).toBe('Pendiente');
  });

  it('should expose categories from RemoteConfigService', () => {
    expect(component.remoteConfig.categories()).toContain('Personal');
    expect(component.remoteConfig.categories()).toContain('Trabajo');
  });

  it('should not save when title is empty', () => {
    createTodoUseCase.execute.calls.reset();
    component.title = '';
    component.onSave();
    expect(createTodoUseCase.execute).not.toHaveBeenCalled();
  });

  it('should not save when title is only whitespace', () => {
    createTodoUseCase.execute.calls.reset();
    component.title = '   ';
    component.onSave();
    expect(createTodoUseCase.execute).not.toHaveBeenCalled();
  });

  it('should not save when category is empty', () => {
    createTodoUseCase.execute.calls.reset();
    component.title = 'Tarea válida';
    component.category = '';
    component.onSave();
    expect(createTodoUseCase.execute).not.toHaveBeenCalled();
  });

  it('should not save when category is only whitespace', () => {
    createTodoUseCase.execute.calls.reset();
    component.title = 'Tarea válida';
    component.category = '   ';
    component.onSave();
    expect(createTodoUseCase.execute).not.toHaveBeenCalled();
  });

  it('should save todo with correct values and navigate to todos', () => {
    component.title = 'Nueva tarea';
    component.category = 'Personal';
    component.status = 'Completado';
    component.onSave();

    expect(createTodoUseCase.execute).toHaveBeenCalledWith('Nueva tarea', 'Personal', 'Completado');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/todos');
  });

  it('should trim title before saving', () => {
    component.title = '  Tarea con espacios  ';
    component.category = 'Trabajo';
    component.status = 'Pendiente';
    component.onSave();

    expect(createTodoUseCase.execute).toHaveBeenCalledWith('Tarea con espacios', 'Trabajo', 'Pendiente');
  });

  it('should navigate back to todos when atras is clicked', () => {
    component.onBack();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/todos');
  });

  it('should expose statuses Pendiente and Completado', () => {
    expect(component.statuses).toEqual(['Pendiente', 'Completado']);
  });
});
