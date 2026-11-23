import type { Todo } from '../App';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={todo.done ? 'done' : ''}>
      <span onClick={() => onToggle(todo.id)} style={{ flex: 1, cursor: 'pointer' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </li>
  );
}