import React from 'react';

interface CrimeActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onCrimeComplete?: () => void;
}

interface WorkActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onWorkComplete?: () => void;
}

const CrimeActivity: React.FC<CrimeActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity crime">
      <h2>Crime Activity</h2>
      <p>Engage in criminal activities to earn money quickly.</p>
      <button onClick={() => onCooldownChange?.(true, 30)}>Start Crime</button>
    </div>
  );
};

export default CrimeActivity;
