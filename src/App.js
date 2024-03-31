import React, { useState } from 'react';
import './App.css';

// Define the ConfirmationModal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Do you wish to delete this task?</h3>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

const initialTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout',
    endDate: null,
    status: 'Pending',
    assignee: '@Hari',
    priority: 'P1',
    team: '' // Initially empty
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout',
    endDate: null,
    status: 'In Progress',
    assignee: '@Hari',
    priority: 'P2',
    team: ''
  },
  // Add more tasks as needed
];

const statusOptions = ['Pending', 'In Progress', 'Completed', 'Deployed', 'Deferred'];
const priorityOptions = ['P1', 'P2', 'P3', 'P4', 'P5'];

const App = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    endDate: null,
    status: 'Pending',
    assignee: '',
    priority: 'P1',
    team: '' // Initially empty
  });
  const [editableTask, setEditableTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddTask = () => {
    const updatedTasks = [...tasks, { ...newTask, id: tasks.length + 1 }];
    setTasks(updatedTasks);
    setNewTask({
      title: '',
      description: '',
      endDate: null,
      status: 'Pending',
      assignee: '',
      priority: 'P1',
      team: '' // Initially empty
    });
    setShowAddTaskForm(false); // Hide the add task form after adding task
  };

  const handleCloseTask = () => {
    setShowAddTaskForm(false); // Hide the add task form
    setEditableTask(null); // Clear editable task if any
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowConfirmationModal(true);
  };

  const confirmDeleteTask = () => {
    const updatedTasks = tasks.filter(task => task.id !== taskToDelete);
    setTasks(updatedTasks);
    setShowConfirmationModal(false);
  };

  const handleEditTask = (task) => {
    setShowAddTaskForm(true);
    setEditableTask({ ...task });
    // Set the form fields with the details of the selected task only if it's not in edit mode
    if (!showAddTaskForm) {
      setNewTask({ ...task });
    }
  };

  const handleSaveEditedTask = () => {
    if (editableTask) {
      const updatedTasks = tasks.map(t =>
        t.id === editableTask.id ? { ...t, ...newTask } : t
      );
      setTasks(updatedTasks);
    } else {
      const updatedTasks = [...tasks, { ...newTask, id: tasks.length + 1 }];
      setTasks(updatedTasks);
    }
    setShowAddTaskForm(false);
    setNewTask({
      title: '',
      description: '',
      endDate: null,
      status: 'Pending',
      assignee: '',
      priority: 'P1',
      team: ''
    });
    setEditableTask(null);
  };

  const toggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  // Group tasks by status
  const tasksByStatus = {};
  tasks.forEach(task => {
    if (!tasksByStatus[task.status]) {
      tasksByStatus[task.status] = [];
    }
    tasksByStatus[task.status].push(task);
  });

  return (
    <div className="App">
      <h1>Task Tracker</h1>
      {showAddTaskForm && (
        <div className="task-form-container">
          <div className="form-row">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="assignee">Assignee:</label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={newTask.assignee}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
            >
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="team">Team:</label>
            <input
              type="text"
              id="team"
              name="team"
              value={newTask.team}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-row">
            <button className="submit-button" onClick={handleSaveEditedTask}>Submit</button>
            <button className="reset-button" onClick={handleCloseTask}>Cancel</button>
          </div>
        </div>
      )}
      {!showAddTaskForm && (
        <button className="add" onClick={() => setShowAddTaskForm(true)}>Add New Task</button>
      )}
      <div className="status-columns">
        {statusOptions.map(status => (
          <div key={status} className={`status-box status-${status.replace(/\s+/g, '')}`}>
            <h2 className={`status status-${status.replace(/\s+/g, '')}`}>{status}</h2>
            <div className="task-list">
              {tasksByStatus[status]?.map(task => (
                <div key={task.id} className="task-details task">
                  <div className="task-details-left">
                    <div className="task-name">{task.title}</div>
                    <div className="description">{task.description}</div>
                    <div className="assignee">{task.assignee}</div>
                    {task.status === 'Pending' && (
                      <div className="assign-button-container">
                        <button className="assign-button">Assign</button>
                      </div>
                    )}
                    {task.status !== 'Pending' && (
                      <div className="status-button-container">
                        <button className="status-button">{task.status}</button>
                      </div>
                    )}
                  </div>
                  <div className="task-details-right">
                    <div className="options">
                      <div className="dropdown">
                        <button className="dropdown-btn" onClick={() => toggleExpand(task.id)}>:</button>
                        <div className="dropdown-content">
                          <button onClick={() => handleEditTask(task)}>Edit</button>
                          <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </div>
                      </div>
                      <div className="priority">{task.priority}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmDeleteTask}
      />
    </div>
  );
};

export default App;
