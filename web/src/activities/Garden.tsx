import React from 'react';

interface GardenActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onGardenComplete?: () => void;
}

const GardenActivity: React.FC<GardenActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity garden">
      <h2>Garden Activity</h2>
      <p>Garden and grow plants for food and resources.</p>
      <button onClick={() => onCooldownChange?.(true, 240)}>Start Gardening</button>
    </div>
  );
};

export default GardenActivity;
