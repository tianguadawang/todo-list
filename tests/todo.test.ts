import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addTodo, toggleTodo, getTodos, resetTodos } from '../src/todo';

// 模拟浏览器 localStorage（Node 环境没有）
const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
});

describe('addTodo', () => {
  beforeEach(() => {
    resetTodos();
    localStorage.clear();
  });

  it('正常添加：todos 长度 +1，内容正确', () => {
    addTodo('学 TS');
    const todos = getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('学 TS');
    expect(todos[0].done).toBe(false);
    expect(typeof todos[0].id).toBe('number');
  });

  it('边界：空字符串不添加', () => {
    addTodo('');
    expect(getTodos()).toHaveLength(0);
  });

  it('边界：纯空格不添加', () => {
    addTodo('   ');
    expect(getTodos()).toHaveLength(0);
  });
});

describe('toggleTodo', () => {
  beforeEach(() => {
    resetTodos();
    localStorage.clear();
  });

  it('正常切换：done 从 false 变 true', () => {
    addTodo('跑步');
    const id = getTodos()[0].id;
    toggleTodo(id);
    expect(getTodos()[0].done).toBe(true);
  });

  it('边界：不存在的 id 不改变任何任务', () => {
    addTodo('A');
    const before = getTodos()[0].done;
    toggleTodo(999999);
    expect(getTodos()[0].done).toBe(before);
    expect(getTodos()).toHaveLength(1);
  });
});

describe('AI 测试审查后的修补用例', () => {
  beforeEach(() => {
    resetTodos();
    localStorage.clear();
  });

  it('空字符串不添加（精确断言长度 0）', () => {
    addTodo('');
    expect(getTodos()).toHaveLength(0);
  });

  it('纯空格不添加（精确断言长度 0）', () => {
    addTodo('   ');
    expect(getTodos()).toHaveLength(0);
  });

  it('trim 后存储（精确断言 text）', () => {
    addTodo('  hello  ');
    expect(getTodos()[0].text).toBe('hello');
  });

  it('toggle 两次回到未完成（精确断言 done 为 false）', () => {
    addTodo('a');
    const id = getTodos()[0].id;
    toggleTodo(id);
    toggleTodo(id);
    expect(getTodos()[0].done).toBe(false);
  });

  it('重复 text 产生两条独立记录（id 不同）', () => {
    addTodo('same');
    addTodo('same');
    expect(getTodos()).toHaveLength(2);
    expect(getTodos()[0].id).not.toBe(getTodos()[1].id);
  });

  it('NaN id 不修改任何任务', () => {
    addTodo('a');
    const before = getTodos()[0].done;
    toggleTodo(NaN);
    expect(getTodos()[0].done).toBe(before);
  });
});