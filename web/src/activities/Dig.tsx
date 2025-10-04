import React from 'react';

interface DigActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onDigComplete?: () => void;
}

const DigActivity: React.FC<DigActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity dig">
      <h2>Dig Activity</h2>
      <p>Dig for treasures and artifacts underground.</p>
      <button onClick={() => onCooldownChange?.(true, 120)}>Start Digging</button>
    </div>
  );
};

export default DigActivity;
