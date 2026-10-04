import React, { useState } from 'react'
import './TaskForm.css'

const TaskForm = ({ addTask }) => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    addTask({
      text: task.trim(),
      priority,
      category,
      dueDate: dueDate || null,
      completed: false,
    });

    setTask('');
    setPriority('medium');
    setCategory('general');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form" id="task-form">
      <div className="task-form__input-row">
        <input
          type="text"
          className="task-form__input"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          id="task-input"
          aria-label="Task description"
        />
        <button type="submit" className="task-form__submit" id="add-task-btn">
          Add
        </button>
      </div>

      <div className="task-form__options">
        <select
          className="task-form__select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Priority"
          id="priority-select"
        >
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>

        <select
          className="task-form__select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
          id="category-select"
        >
          <option value="general">General</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="health">Health</option>
          <option value="learning">Learning</option>
        </select>

        <input
          type="date"
          className="task-form__date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          id="due-date-input"
        />
      </div>
    </form>
  );
};

export default TaskForm