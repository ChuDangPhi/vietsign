/**
 * Shared Types
 * Export all shared TypeScript types and interfaces
 */
import React from 'react';

// Common Props
export interface LearningToolProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  reverse?: boolean;
}

// Enums
export enum DictionaryMode {
  SEARCH = 'search',
  SIGN_OF_DAY = 'sign_of_day',
  GAME = 'game'
}
