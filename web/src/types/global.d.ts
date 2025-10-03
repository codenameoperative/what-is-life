// Global React types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
declare module '../../contexts/GameContext' {
  export const useGame: any; // Replace 'any' with proper types if available
}

declare module '../../contexts/MultiplayerContext' {
  export const useMultiplayer: any; // Replace 'any' with proper types if available
}

declare module '../../contexts/NotifyContext' {
  export const useNotify: any; // Replace 'any' with proper types if available
}

// Activities
declare module '../../activities/Crime' {
  const CrimeActivity: React.ComponentType<any>;
  export default CrimeActivity;
}

declare module '../../activities/Work' {
  const WorkActivity: React.ComponentType<any>;
  export default WorkActivity;
}

declare module '../../activities/Search' {
  const SearchActivity: React.ComponentType<any>;
  export default SearchActivity;
}

declare module '../../activities/Hunt' {
  const HuntActivity: React.ComponentType<any>;
  export default HuntActivity;
}

declare module '../../activities/Fish' {
  const FishActivity: React.ComponentType<any>;
  export default FishActivity;
}

declare module '../../activities/Dig' {
  const DigActivity: React.ComponentType<any>;
  export default DigActivity;
}

declare module '../../activities/Post' {
  const PostActivity: React.ComponentType<any>;
  export default PostActivity;
}

declare module '../../activities/Stream' {
  const StreamActivity: React.ComponentType<any>;
  export default StreamActivity;
}

declare module '../../activities/Explore' {
  const ExploreActivity: React.ComponentType<any>;
  export default ExploreActivity;
}

declare module '../../activities/Garden' {
  const GardenActivity: React.ComponentType<any>;
  export default GardenActivity;
}

declare module './Toaster/index' {
  const Toaster: React.ComponentType<any>;
  export default Toaster;
}

declare module './ErrorLogViewer' {
  export const ErrorLogViewer: React.ComponentType<any>;
}

declare module './MiniGamesSelector' {
  const MiniGamesSelector: React.ComponentType<any>;
  export default MiniGamesSelector;
}

declare module './MiniGames' {
  const MiniGames: React.ComponentType<any>;
  export type MiniGameType = string;
  export default MiniGames;
}

declare module './UpdateModal' {
  const UpdateModal: React.ComponentType<any>;
  export default UpdateModal;
}

declare module './Header' {
  const Header: React.ComponentType<any>;
  export default Header;
}

declare module './UtilityBar' {
  const UtilityBar: React.ComponentType<any>;
  export default UtilityBar;
}

declare module './LANPartyModal' {
  const LANPartyModal: React.ComponentType<any>;
  export default LANPartyModal;
}

declare module './UsernameModal/index' {
  const UsernameModal: React.ComponentType<any>;
  export default UsernameModal;
}

declare module './Footer' {
  const Footer: React.ComponentType<any>;
  export default Footer;
}
