import React from 'react';

interface PostActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onPostComplete?: () => void;
}

const PostActivity: React.FC<PostActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity post">
      <h2>Post Activity</h2>
      <p>Post content online to earn money and followers.</p>
      <button onClick={() => onCooldownChange?.(true, 15)}>Start Posting</button>
    </div>
  );
};

export default PostActivity;
