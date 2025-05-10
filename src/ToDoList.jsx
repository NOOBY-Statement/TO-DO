import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [search, setSearch] = useState('');

  const addTodo = () => {
    if (task.trim() === '') return;
    const newTodo = {
      id: Date.now(),
      text: task,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setTask('');
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[600px] h-[800px] mx-auto mt-4 p-4 bg-gray-800 rounded-lg text-white flex flex-col">
        {/* Header */}
      <div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
        />
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            Add
          </button>
        </div>
      </div>
  
      {/* Scrollable Task List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredTodos.map(todo => (
          <div
            key={todo.id}
            className="flex justify-between items-center bg-gray-900 p-4 rounded mb-2 shadow-md"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="accent-blue-500"
              />
              <span className={`${todo.completed ? 'line-through opacity-50' : ''}`}>
                {todo.text}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaEdit className="text-blue-400 cursor-pointer" />
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={() => deleteTodo(todo.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
