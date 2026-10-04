import React from 'react'
import './ProgressTracker.css'

const ProgressTracker = ({ tasks }) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const isComplete = progress === 100 && totalTasks > 0;

  return (
    <div className="progress-tracker" id="progress-tracker">
      <div className="progress-tracker__header">
        <span className="progress-tracker__label">Progress</span>
        <span className="progress-tracker__percent">{progress}%</span>
      </div>
      <div className="progress-tracker__bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`progress-tracker__fill ${isComplete ? 'progress-tracker__complete' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="progress-tracker__summary">
        {completedTasks} of {totalTasks} done
      </p>
    </div>
  );
};

export default ProgressTracker