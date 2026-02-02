export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  reverse?: boolean;
}

export interface LearningToolProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export enum DictionaryMode {
  SEARCH = "SEARCH",
  SIGN_OF_DAY = "SIGN_OF_DAY",
  GAME = "GAME",
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  isLoading?: boolean;
}

export interface HeroProps {
  title: string;
  subtitle?: string; 
  imageUrl?: string;
  onCtaClick?: () => void;
}