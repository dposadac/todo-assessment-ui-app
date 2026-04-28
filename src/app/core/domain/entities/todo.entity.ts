export type TodoStatus = 'Pendiente' | 'Completado';
export type TodoCategory = string;

export interface Todo {
  id: string;
  title: string;
  category: TodoCategory;
  status: TodoStatus;
  createdAt: Date;
}
