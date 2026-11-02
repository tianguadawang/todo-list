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

export function getFilter(): Filter {
  return filter;
}

export function setFilter(f: Filter): void {
  filter = f;
}

/* ========== 4. 运行时校验（严禁 any） ========== */
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

/* ========== 5. 持久化 ========== */
function save(): void {
  localStorage.setItem('todos', JSON.stringify(todos));
}

export function load(): void {
  try {
    const raw = localStorage.getItem('todos');
    if (!raw) {
      todos = [];
      return;
    }
    const parsed: unknown = JSON.parse(raw);
    if (isTodoArray(parsed)) {
      todos = parsed;
    } else {
      todos = [];
      console.warn('localStorage 数据形状不合法，已重置');
    }
  } catch (e) {
    todos = [];
    console.warn('localStorage 数据损坏，已重置');
  }
}

/* ========== 6. 操作函数（不可变更新） ========== */
export function addTodo(text: string): void {
  if (typeof text !== 'string') return;
  const trimmed = text.trim();
  if (!trimmed) return;
  todos = [...todos, { id: nextId(), text: trimmed, done: false }];
  save();
}

export function removeTodo(id: number): void {
  if (typeof id !== 'number' || Number.isNaN(id)) return;
  todos = todos.filter(t => t.id !== id);
  save();
}

export function toggleTodo(id: number): void {
  if (typeof id !== 'number' || Number.isNaN(id)) return;
  todos = todos.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  save();
}

export function clearCompleted(): void {
  todos = todos.filter(t => !t.done);
  save();
}

/* ========== 7. 渲染 ========== */
export function render(): void {
  const list = document.querySelector<HTMLUListElement>('#list');
  if (!list) return;
  list.innerHTML = '';

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  if (visibleTodos.length === 0) {
    const li = document.createElement('li');
    li.textContent = '暂无任务';
    list.appendChild(li);
  } else {
    visibleTodos.forEach(todo => {
      const li = document.createElement('li');
      li.dataset.id = String(todo.id);
      if (todo.done) li.classList.add('done');

      const span = document.createElement('span');
      span.className = 'text';
      span.dataset.action = 'toggle';
      span.textContent = todo.text;

      const edit = document.createElement('button');
      edit.className = 'edit';
      edit.dataset.action = 'edit';
      edit.textContent = '✎';

      const del = document.createElement('button');
      del.className = 'del';
      del.dataset.action = 'delete';
      del.textContent = '×';

      li.appendChild(span);
      li.appendChild(edit);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  const count = document.querySelector<HTMLSpanElement>('#count');
  if (count) {
    const activeCount = todos.filter(t => !t.done).length;
    count.textContent = `${activeCount} 项未完成`;
  }

  document.querySelectorAll<HTMLButtonElement>('.filters button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

/* ========== 8. 事件委托 ========== */
export function bindEvents(): void {
  const list = document.querySelector<HTMLUListElement>('#list');
  if (!list) return;

  list.addEventListener('click', (e: Event) => {
    if (!(e.target instanceof Element)) return;
    const item = e.target.closest<HTMLLIElement>('li');
    if (!item || !list.contains(item)) return;
    const rawId = item.dataset.id;
    if (!rawId) return;
    const id = Number(rawId);
    if (Number.isNaN(id)) return;

    if (e.target.closest('[data-action="delete"]')) {
      removeTodo(id);
    } else if (e.target.closest('[data-action="edit"]')) {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;
      const next = prompt('编辑任务', todo.text);
      if (next === null) return;
      const text = next.trim();
      if (!text) return;
      todos = todos.map(t =>
        t.id === id ? { ...t, text } : t
      );
      save();
    } else if (e.target.closest('[data-action="toggle"]')) {
      toggleTodo(id);
    }
    render();
  });

  const addBtn = document.querySelector<HTMLButtonElement>('#add-btn');
  const input = document.querySelector<HTMLInputElement>('#new-todo');
  if (addBtn && input) {
    addBtn.addEventListener('click', () => {
      addTodo(input.value);
      input.value = '';
      render();
    });
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        addTodo(input.value);
        input.value = '';
        render();
      }
    });
  }

  document.querySelectorAll<HTMLButtonElement>('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      if (f === 'all' || f === 'active' || f === 'completed') {
        filter = f;
        render();
      }
    });
  });

  const clearBtn = document.querySelector<HTMLButtonElement>('#clear-completed');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearCompleted();
      render();
    });
  }
}