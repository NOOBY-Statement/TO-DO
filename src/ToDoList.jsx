import { useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes, FaPlus, FaFlag, FaSearch, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('work');
  const [activePriorityFilter, setActivePriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const addTodo = () => {
    if (newTaskTitle.trim() === '') return;
    const newTodo = {
      id: Date.now(),
      text: newTaskTitle,
      description: newTaskDescription,
      category: newTaskCategory,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      createdAt: new Date()
    };
    setTodos([newTodo, ...todos]);
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskCategory('work');
    setNewTaskPriority('medium');
    setNewTaskDueDate('');
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const confirmDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Filter todos based on search and priority filter
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase()) || 
    todo.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = activePriorityFilter === 'all' || todo.priority === activePriorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Separate completed and pending tasks
  const pendingTodos = filteredTodos.filter(todo => !todo.completed);
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  // Sort pending tasks by priority (high first) and then by due date (earlier first)
  const sortedPendingTodos = [...pendingTodos].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  // Priority colors and icons
  const priorityData = {
    high: { color: 'border-red-500', icon: <FaFlag className="text-red-500" />, bg: 'bg-red-500/10' },
    medium: { color: 'border-yellow-500', icon: <FaFlag className="text-yellow-500" />, bg: 'bg-yellow-500/10' },
    low: { color: 'border-green-500', icon: <FaFlag className="text-green-500" />, bg: 'bg-green-500/10' }
  };

  // Category colors
  const categoryColors = {
    work: 'bg-blue-500/10 text-blue-400',
    personal: 'bg-purple-500/10 text-purple-400',
    shopping: 'bg-green-500/10 text-green-400',
    other: 'bg-gray-500/10 text-gray-400'
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining
  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-[600px] h-[800px] mx-auto mt-4 p-4 bg-gray-800 rounded-lg text-white flex flex-col relative overflow-hidden">
      {/* Search and Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 p-2 rounded-lg ${activePriorityFilter !== 'all' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-600 transition-colors`}
          >
            <FaFilter size={14} />
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-20 p-2">
              <div className="text-xs text-gray-400 px-2 py-1">Filter by priority</div>
              {['all', 'high', 'medium', 'low'].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setActivePriorityFilter(level);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${activePriorityFilter === level ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                >
                  {level !== 'all' && priorityData[level]?.icon}
                  <span className="capitalize">{level}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {/* Scrollable Task List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Pending Tasks */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
              {pendingTodos.length}
            </span>
            Pending Tasks
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
          >
            <FaPlus size={12} /> Add Task
          </button>
        </div>
        
        {sortedPendingTodos.length === 0 && (
          <div className="text-center py-6 bg-gray-700/50 rounded-lg">
            <p className="text-gray-400">No pending tasks</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center gap-1 mx-auto"
            >
              <FaPlus size={10} /> Add your first task
            </button>
          </div>
        )}
        
        {sortedPendingTodos.map(todo => (
          <div
            key={todo.id}
            className={`flex justify-between items-start bg-gray-900 p-4 rounded-lg mb-3 shadow-md border-l-4 ${priorityData[todo.priority].color} hover:bg-gray-850 transition-colors duration-150`}
          >
            <div className="flex items-start gap-3 flex-1">
              <button
                onClick={() => toggleComplete(todo.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-1 ${todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-blue-400'}`}
              >
                {todo.completed && <FaCheck className="text-white text-xs" />}
              </button>
              
              <div className="flex-1">
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                  />
                ) : (
                  <div className="font-medium">{todo.text}</div>
                )}
                
                {todo.description && (
                  <div className="text-sm text-gray-300 mt-1">{todo.description}</div>
                )}
                
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${categoryColors[todo.category]}`}>
                    {todo.category}
                  </span>
                  
                  {todo.dueDate && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <FaCalendarAlt size={10} />
                      <span>{formatDate(todo.dueDate)}</span>
                      {getDaysRemaining(todo.dueDate) !== null && (
                        <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                          getDaysRemaining(todo.dueDate) <= 0 ? 'bg-red-500/20 text-red-400' :
                          getDaysRemaining(todo.dueDate) <= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {getDaysRemaining(todo.dueDate) <= 0 ? 'Due' : 
                           getDaysRemaining(todo.dueDate) === 1 ? '1 day left' : 
                           `${getDaysRemaining(todo.dueDate)} days left`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {editingId === todo.id ? (
                <>
                  <button 
                    onClick={() => saveEdit(todo.id)}
                    className="p-1.5 rounded-full bg-green-600 hover:bg-green-500 transition-colors"
                    title="Save"
                  >
                    <FaCheck className="text-white text-sm" />
                  </button>
                  <button 
                    onClick={cancelEdit}
                    className="p-1.5 rounded-full bg-red-600 hover:bg-red-500 transition-colors"
                    title="Cancel"
                  >
                    <FaTimes className="text-white text-sm" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => startEditing(todo)}
                    className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
                    title="Edit"
                  >
                    <FaEdit className="text-blue-400 text-sm" />
                  </button>
                  <button
                    onClick={() => confirmDelete(todo.id)}
                    className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
                    title="Delete"
                  >
                    <FaTrash className="text-red-400 text-sm" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-3 mt-6">
              <h2 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
                  {completedTodos.length}
                </span>
                Completed Tasks
              </h2>
            </div>
            
            {completedTodos.map(todo => (
              <div
                key={todo.id}
                className={`flex justify-between items-start bg-gray-900/50 p-4 rounded-lg mb-3 shadow-md border-l-4 ${priorityData[todo.priority].color} opacity-80 hover:opacity-100 transition-opacity`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className="w-5 h-5 rounded bg-green-500 border-green-500 flex items-center justify-center mt-1"
                    title="Mark as incomplete"
                  >
                    <FaCheck className="text-white text-xs" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="font-medium line-through">{todo.text}</div>
                    
                    {todo.description && (
                      <div className="text-sm text-gray-300 mt-1 line-through">{todo.description}</div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${categoryColors[todo.category]}`}>
                        {todo.category}
                      </span>
                      
                      {todo.dueDate && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <FaCalendarAlt size={10} />
                          <span>{formatDate(todo.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => confirmDelete(todo.id)}
                  className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
                  title="Delete"
                >
                  <FaTrash className="text-red-400 text-sm" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add Task Modal Overlay */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 animate-fadeIn">
          <div className="bg-gray-800 p-6 rounded-xl w-11/12 max-w-md border border-gray-700 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Task</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              >
                <IoMdClose className="text-gray-300 text-lg" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Task Title*</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What needs to be done?"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add details about this task..."
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Due Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <FaCalendarAlt className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {['high', 'medium', 'low'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setNewTaskPriority(level)}
                      className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${newTaskPriority === level ? 
                        level === 'high' ? 'border-red-500 bg-red-500/10' :
                        level === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                        'border-green-500 bg-green-500/10' : 
                        'border-gray-600 hover:border-gray-500'}`}
                    >
                      <FaFlag className={
                        newTaskPriority === level ? 
                          level === 'high' ? 'text-red-400' :
                          level === 'medium' ? 'text-yellow-400' :
                          'text-green-400' : 
                          'text-gray-400'
                      } />
                      <span className="capitalize text-sm">{level}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors flex items-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={addTodo}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  newTaskTitle.trim() ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-500 cursor-not-allowed'
                }`}
                disabled={!newTaskTitle.trim()}
              >
                <FaPlus size={12} /> Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 animate-fadeIn">
          <div className="bg-gray-800 p-6 rounded-xl w-11/12 max-w-md border border-gray-700 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
              <button
                onClick={cancelDelete}
                className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              >
                <IoMdClose className="text-gray-300 text-lg" />
              </button>
            </div>
            
            <p className="mb-6 text-gray-300">Are you sure you want to delete this task? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTodo(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}