import React from "react";

interface ProgressBarProps {
  progressPercentage: number;
}

const ProgressBarComp: React.FC<ProgressBarProps> = ({ progressPercentage }) => {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      <div className="progress-label">{Math.round(progressPercentage)}%</div>
    </div>
  );
};

export default ProgressBarComp;
