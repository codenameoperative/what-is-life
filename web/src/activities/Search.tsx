import React from 'react';

interface SearchActivityProps {
  isOnCooldown?: boolean;
  cooldownTime?: number;
  onCooldownChange?: (isOnCooldown: boolean, timeLeft: number) => void;
  onSearchComplete?: () => void;
}

const SearchActivity: React.FC<SearchActivityProps> = ({ onCooldownChange }) => {
  return (
    <div className="activity search">
      <h2>Search Activity</h2>
      <p>Search for items and opportunities in your area.</p>
      <button onClick={() => onCooldownChange?.(true, 15)}>Start Search</button>
    </div>
  );
};

export default SearchActivity;
