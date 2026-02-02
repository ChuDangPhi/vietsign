export type StepType =
  | "vocabulary"
  | "sentence"
  | "match-video-to-text"
  | "quiz-video-to-text"
  | "quiz-text-to-video"
  | "quiz-video-to-image"
  | "quiz-input"
  | "flip-card"
  | "true-false"
  | "practice-video"
  | "practice-matrix"
  | "match-video-image"
  | "match-video-word"
  | "drag-drop-video-word"
  | "match-horizontal"
  | "quiz-choice";

export interface BaseStepItem {
  id: number;
  title: string;
  type: StepType;
  description?: string;
  completed?: boolean;
  [key: string]: any;
}

export interface StepProps {
  step: BaseStepItem;
  onComplete?: () => void;
}
