import React, { useEffect, useState } from 'react'
import TaskForm from './Components/TaskForm'
import ProgressTracker from './Components/ProgressTracker'
import TaskList from './Components/TaskList'
import './App.css'

const App = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskzen-tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskzen-theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('taskzen-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskzen-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask, index) => {
    setTasks(prev => {
      const next = [...prev];
      next[index] = updatedTask;
      return next;
    });
  };

  const deleteTask = (index) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate) < new Date(new Date().toDateString());
  }).length;

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <h1 className="app-header__title">
            taskzen<span>.</span>
          </h1>
        </div>
        <p className="app-header__subtitle">keep track of what matters</p>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '◐' : '◑'}
        </button>
      </header>

      {totalTasks > 0 && (
        <section className="stats-bar" aria-label="Task statistics">
          <div className="stat-card">
            <div className="stat-card__value">{totalTasks}</div>
            <div className="stat-card__label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{completedTasks}</div>
            <div className="stat-card__label">Done</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{pendingTasks}</div>
            <div className="stat-card__label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{overdueTasks}</div>
            <div className="stat-card__label">Overdue</div>
          </div>
        </section>
      )}

      <main className="app-content">
        <TaskForm addTask={addTask} />

        {totalTasks === 0 ? (
          <div className="empty-state">
            <div className="empty-state__title">No tasks yet</div>
            <p className="empty-state__text">
              Add a task above to get started.
            </p>
          </div>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
            <ProgressTracker tasks={tasks} />
            <button className="clear-all-btn" onClick={clearTasks}>
              Clear all tasks
            </button>
          </>
        )}
      </main>

      <footer className="app-footer">
        taskzen
      </footer>
    </>
  );
};

export default App