import React from 'react';

interface StreamActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onStreamComplete?: () => void;
}

const StreamActivity: React.FC<StreamActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity stream">
      <h2>Stream Activity</h2>
      <p>Stream content online to earn donations and subscribers.</p>
      <button onClick={() => onCooldownChange?.(true, 180)}>Start Streaming</button>
    </div>
  );
};

export default StreamActivity;
