import React from 'react';

interface WorkActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onWorkComplete?: () => void;
}

const WorkActivity: React.FC<WorkActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity work">
      <h2>Work Activity</h2>
      <p>Work a legitimate job to earn steady income.</p>
      <button onClick={() => onCooldownChange?.(true, 10)}>Start Work</button>
    </div>
  );
};

export default WorkActivity;
