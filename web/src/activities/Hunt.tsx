import React from 'react';

interface HuntActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onHuntComplete?: () => void;
}

const HuntActivity: React.FC<HuntActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity hunt">
      <h2>Hunt Activity</h2>
      <p>Hunt for food and resources in the wilderness.</p>
      <button onClick={() => onCooldownChange?.(true, 90)}>Start Hunt</button>
    </div>
  );
};

export default HuntActivity;
