import type { Todo } from '../App';
import { useTheme } from '../ThemeContext';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { theme } = useTheme(); // 消费主题

  return (
    <li className={`${todo.done ? 'done' : ''} ${theme === 'dark' ? 'dark-li' : ''}`}>
      <span onClick={() => onToggle(todo.id)} style={{ flex: 1, cursor: 'pointer' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </li>
  );
}