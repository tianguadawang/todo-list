import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { useTheme } from './ThemeContext';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// 安全读取
const loadTodos = (): Todo[] => {
  try {
    const saved = localStorage.getItem('todos');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function App() {
  // 惰性初始化
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const { theme, setTheme } = useTheme();

  // 单 Effect 写入
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos([...todos, { id: Date.now(), text: trimmed, done: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    // 动态绑定主题 class
    <div className={theme}>
      <h1>Todo V4.0</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题 (当前: {theme})
      </button>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={removeTodo} />
    </div>
  );
}