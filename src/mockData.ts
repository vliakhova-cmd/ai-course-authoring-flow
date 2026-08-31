import { GeneratedSlide, LessonType } from './types';

import cardVideo from './assets/card-video.png';
import card1 from './assets/card-1.png';
import card2 from './assets/card-2.png';
import card3 from './assets/card-3.png';
import themeBg from './assets/theme-bg.png';

export { themeBg };

export const DEFAULT_SOURCE_DOC = 'Regulatory Document Management';

export const DEFAULT_DESCRIPTION =
  'SOP for CRAs and trial coordinators on managing regulatory trial documents. Covers TMF structure, filing standards, version control, and inspection readiness. Goal: ensure consistent, audit-ready document handling across all trial sites.';

export const LANGUAGES = ['English', 'Spanish', 'French', 'German'];

export interface LessonTypeDef {
  id: LessonType;
  label: string;
  color: string;
  bg: string;
  border: string;
}

export const LESSON_TYPES: LessonTypeDef[] = [
  { id: 'document', label: 'Document Into Lesson', color: '#25861E', bg: 'rgba(37,134,30,0.1)', border: 'rgba(37,134,30,0.5)' },
  { id: 'video', label: 'Video Lesson', color: '#7349AA', bg: 'rgba(115,73,170,0.1)', border: 'rgba(115,73,170,0.5)' },
  { id: 'analysis', label: 'Analysis', color: '#1972AA', bg: 'rgba(25,114,170,0.1)', border: 'rgba(25,114,170,0.5)' },
  { id: 'assessment', label: 'Assessment', color: '#B451A2', bg: 'rgba(180,81,162,0.1)', border: 'rgba(180,81,162,0.5)' },
];

export const GENERATED_SLIDES: GeneratedSlide[] = [
  { id: 'video', label: 'Video Intro — SOW-2024-0892', image: cardVideo },
  { id: 'deliverables', label: 'Three Core Deliverables', image: card1 },
  { id: 'legal', label: 'Commercial & Legal Terms', image: card2 },
  { id: 'quiz', label: 'Knowledge Check', image: card3 },
];

export const AI_INTRO_RESPONSE =
  "I can see the selected noteTile. I'll update it to include the key points from the video and a clear reference to the companion course.\n\nUpdated. The noteTile below the video now has two clear sections:\n\nKey Points — 8 bullet summary covering scope, deliverables, quality thresholds, acceptance, payment, IP, confidentiality, and termination\nCourse reference — a clear call-out to companion course for learners who want the full detail";

export const AI_FOLLOWUP_RESPONSES = [
  "Got it — I've reworked that section to reflect your note. Take a look at the updated slide on the left.",
  "Done. I adjusted the wording and kept the key figures intact so the compliance details stay accurate.",
  "Updated the slide accordingly. Let me know if you'd like a different tone or more detail anywhere.",
];
