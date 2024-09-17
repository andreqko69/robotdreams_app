import {useEffect, useState} from 'react'
import './App.css'

const apiUrl = 'http://18.153.55.24';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  // Fetch all todos (READ)
  const fetchTodos = async () => {
    const response = await fetch(`${apiUrl}/todos`);
    const data = await response.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create a new todo (CREATE)
  const createTodo = async () => {
    const newTodo = { title, description };

    const response = await fetch(`${apiUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    });

    if (response.ok) {
      fetchTodos(); // Refresh the list after creation
      setTitle('');
      setDescription('');
    }
  };

  // Update an existing todo (UPDATE)
  const updateTodo = async (id) => {
    const updatedTodo = { title, description };

    const response = await fetch(`${apiUrl}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });

    if (response.ok) {
      fetchTodos(); // Refresh the list after update
      setEditId(null);
      setTitle('');
      setDescription('');
    }
  };

  // Delete a todo (DELETE)
  const deleteTodo = async (id) => {
    const response = await fetch(`${apiUrl}/todos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchTodos(); // Refresh the list after deletion
    }
  };

  // Handle the form submit for either creating or updating
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateTodo(editId);
    } else {
      createTodo();
    }
  };

  // Start editing a todo
  const startEdit = (todo) => {
    setEditId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  return (
    <div className="todo-container">
      <h1 className="title">Todo List</h1>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="textarea"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="button" type="submit">
          {editId ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-content">
              <h3 className="todo-title">{todo.title}</h3>
              <p className="todo-description">{todo.description}</p>
            </div>
            <div className="todo-actions">
              <button className="button edit-button" onClick={() => startEdit(todo)}>
                Edit
              </button>
              <button className="button delete-button" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
