import TodoList from './ToDoList';

function App() {
  return (
    <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Task-It Easy</h1>
        <TodoList />
      </div>
    </div>
  );
}

export default App;


