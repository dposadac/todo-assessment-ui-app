import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todos',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./presentation/pages/todo-list/todo-list.page').then(
        (m) => m.TodoListPage
      ),
  },
];
