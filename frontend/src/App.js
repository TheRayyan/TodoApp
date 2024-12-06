import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file here

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('Error fetching tasks', error);
            });
    }, [tasks]);

    const addTask = () => {
        axios.post('http://localhost:5000/tasks', { title, description })
            .then(response => {
                setTasks([...tasks, response.data]);
                setTitle('');
                setDescription('');
            })
            .catch(error => {
                console.error('Error adding task', error);
            });
    };

    const toggleComplete = (id, currentStatus) => {
        axios.put(`http://localhost:5000/tasks/${id}`, { isCompleted: !currentStatus })
            .then(response => {
                setTasks(tasks.map(task => task._id === id ? response.data : task));
            })
            .catch(error => {
                console.error('Error updating task', error);
            });
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/tasks/${id}`)
            .then(response => {
                setTasks(tasks.filter(task => task._id !== id));
            })
            .catch(error => {
                console.error('Error deleting task', error);
            });
    };

    return (
        <div className="container">
            <h1>To-Do List</h1>
            <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Task Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id} className={task.isCompleted ? 'completed' : ''}>
                        <span>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p> {/* Add task description here */}
                        </span>
                        <div>
                            <button className="complete" onClick={() => toggleComplete(task._id, task.isCompleted)}>
                                {task.isCompleted ? 'Undo' : 'Complete'}
                            </button>
                            <button className="delete" onClick={() => deleteTask(task._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
