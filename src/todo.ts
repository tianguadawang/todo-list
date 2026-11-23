/* ========== 1. 类型定义 ========== */
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

/* ========== 2. 状态 ========== */
let todos: Todo[] = [];
let filter: Filter = 'all';
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
  filter = 'all';
}

/* ========== 4. 运行时校验 ========== */
function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.text === 'string' &&
    typeof v.done === 'boolean'
  );
}

function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodo);
}

/* ========== 5. 纯函数操作逻辑（供 React 调用和测试） ========== */
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

export function clearCompleted(): void {
  todos = todos.filter(t => !t.done);
}