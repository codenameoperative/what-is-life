import React from 'react';

interface ExploreActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onExploreComplete?: () => void;
}

const ExploreActivity: React.FC<ExploreActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity explore">
      <h2>Explore Activity</h2>
      <p>Explore new areas and discover interesting locations.</p>
      <button onClick={() => onCooldownChange?.(true, 75)}>Start Exploring</button>
    </div>
  );
};

export default ExploreActivity;
