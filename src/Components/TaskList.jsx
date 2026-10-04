import React, { useState } from 'react'
import './TaskList.css'

const CATEGORY_LABELS = {
  general: 'General',
  personal: 'Personal',
  work: 'Work',
  health: 'Health',
  learning: 'Learning',
};

const formatDueDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date(new Date().toDateString());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const isOverdue = (dateStr, completed) => {
  if (!dateStr || completed) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
};

const TaskList = ({ tasks, updateTask, deleteTask }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const toggleComplete = (index) => {
    const updated = { ...tasks[index], completed: !tasks[index].completed };
    updateTask(updated, index);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(tasks[index].text);
  };

  const saveEdit = (index) => {
    if (editText.trim()) {
      const updated = { ...tasks[index], text: editText.trim() };
      updateTask(updated, index);
    }
    setEditingIndex(null);
    setEditText('');
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter') saveEdit(index);
    if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditText('');
    }
  };

  const filtered = tasks.filter((task) => {
    if (search && !task.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'overdue' && !isOverdue(task.dueDate, task.completed)) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const filteredWithIndex = filtered.map(task => ({
    task,
    originalIndex: tasks.indexOf(task),
  }));

  return (
    <div>
      <div className="task-controls">
        <div className="task-controls__search-wrap">
          <span className="task-controls__search-icon">⌕</span>
          <input
            type="text"
            className="task-controls__search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-tasks"
            aria-label="Search tasks"
          />
        </div>
        <select
          className="task-controls__filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
          id="filter-status"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          className="task-controls__filter"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          aria-label="Filter by priority"
          id="filter-priority"
        >
          <option value="all">Any priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {filteredWithIndex.length === 0 ? (
        <div className="task-list__empty">
          No tasks match your filters.
        </div>
      ) : (
        <ul className="task-list" id="task-list">
          {filteredWithIndex.map(({ task, originalIndex }) => {
            const overdue = isOverdue(task.dueDate, task.completed);
            const dueLabel = formatDueDate(task.dueDate);

            return (
              <li
                key={task.id || originalIndex}
                className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
                id={`task-item-${originalIndex}`}
              >
                <label className="task-item__checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(originalIndex)}
                    aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  <span className="task-item__checkmark">✓</span>
                </label>

                <div className="task-item__content">
                  {editingIndex === originalIndex ? (
                    <input
                      type="text"
                      className="task-item__edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(originalIndex)}
                      onKeyDown={(e) => handleEditKeyDown(e, originalIndex)}
                      autoFocus
                    />
                  ) : (
                    <div className="task-item__text">{task.text}</div>
                  )}

                  <div className="task-item__meta">
                    <span className={`tag tag--${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className={`tag tag--category tag--category-${task.category}`}>
                      {CATEGORY_LABELS[task.category] || task.category}
                    </span>
                    {dueLabel && (
                      <span className={`tag ${overdue ? 'tag--overdue' : 'tag--due'}`}>
                        {overdue && '! '}{dueLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-item__actions">
                  <button
                    className="task-item__action-btn"
                    onClick={() => startEditing(originalIndex)}
                    title="Edit"
                    aria-label={`Edit "${task.text}"`}
                  >
                    ✎
                  </button>
                  <button
                    className="task-item__action-btn task-item__action-btn--delete"
                    onClick={() => deleteTask(originalIndex)}
                    title="Delete"
                    aria-label={`Delete "${task.text}"`}
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TaskList