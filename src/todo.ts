/* ========== 1. 类型定义 ========== */
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

/* ========== 2. 状态 ========== */
let todos: Todo[] = [];
let lastId = 0;

function nextId(): number {
  const now = Date.now();
  lastId = now > lastId ? now : lastId + 1;
  return lastId;
}

/* ========== 3. 测试辅助 ========== */
export function getTodos(): Todo[] {
  return todos;
}

export function resetTodos(): void {
  todos = [];
}

/* ========== 4. 纯函数操作逻辑 ========== */
export function addTodo(text: string): void {
  if (typeof text !== 'string') return;
  const trimmed = text.trim();
  if (!trimmed) return;
  todos = [...todos, { id: nextId(), text: trimmed, done: false }];
}

export function removeTodo(id: number): void {
  if (typeof id !== 'number' || Number.isNaN(id)) return;
  todos = todos.filter(t => t.id !== id);
}

export function toggleTodo(id: number): void {
  if (typeof id !== 'number' || Number.isNaN(id)) return;
  if (!todos.some(t => t.id === id)) return;
  todos = todos.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
}