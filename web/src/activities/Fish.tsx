import React from 'react';

interface FishActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onFishComplete?: () => void;
}

const FishActivity: React.FC<FishActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity fish">
      <h2>Fish Activity</h2>
      <p>Fish for food and relaxation by the water.</p>
      <button onClick={() => onCooldownChange?.(true, 60)}>Start Fishing</button>
    </div>
  );
};

export default FishActivity;
