export type League = 'NCAA' | 'High School' | 'AAU' | 'NBA' | 'Euroleague' | 'Other';
export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';
export type AgeGroup = 'U16' | 'U18' | 'U20' | 'U23' | 'Pro';
export type DraftProjection = 'Lottery' | 'First Round' | 'Second Round' | 'Undrafted' | 'TBD';
export type ScoutNoteType = 'strength' | 'weakness' | 'general' | 'red-flag';

export interface SkillRatings {
  shooting: number;
  threePoint: number;
  finishing: number;
  ballHandling: number;
  passing: number;
  perimeterDefense: number;
  interiorDefense: number;
  rebounding: number;
  athleticism: number;
  basketballIQ: number;
  leadership: number;
  workEthic: number;
}

export const SKILL_LABELS: Record<keyof SkillRatings, string> = {
  shooting: 'Mid-Range',
  threePoint: '3-Point',
  finishing: 'Finishing',
  ballHandling: 'Ball Handling',
  passing: 'Passing',
  perimeterDefense: 'Perimeter D',
  interiorDefense: 'Interior D',
  rebounding: 'Rebounding',
  athleticism: 'Athleticism',
  basketballIQ: 'Basketball IQ',
  leadership: 'Leadership',
  workEthic: 'Work Ethic',
};

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ageGroup: AgeGroup;
  position: Position;
  secondaryPosition?: Position;
  height: number; // cm
  weight: number; // kg
  wingspan?: number; // cm
  standingReach?: number; // cm
  nationality: string;
  currentTeam: string;
  league: League;
  skills: SkillRatings;
  overallRating: number;
  potential: number; // 1-100
  draftProjection: DraftProjection;
  draftYear?: number;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameLog {
  id: string;
  playerId: string;
  date: string;
  opponent: string;
  league: League;
  minutes: number;
  points: number;
  rebounds: number;
  offRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgMade: number;
  fgAttempted: number;
  threePtMade: number;
  threePtAttempted: number;
  ftMade: number;
  ftAttempted: number;
  plusMinus: number;
  notes: string;
}

export interface ScoutNote {
  id: string;
  playerId: string;
  date: string;
  content: string;
  type: ScoutNoteType;
  gameId?: string;
}

export const DEFAULT_SKILLS: SkillRatings = {
  shooting: 5,
  threePoint: 5,
  finishing: 5,
  ballHandling: 5,
  passing: 5,
  perimeterDefense: 5,
  interiorDefense: 5,
  rebounding: 5,
  athleticism: 5,
  basketballIQ: 5,
  leadership: 5,
  workEthic: 5,
};

export function calculateOverall(skills: SkillRatings): number {
  const values = Object.values(skills);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10);
}

export function getAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatHeight(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}" (${cm}cm)`;
}

export function formatWeight(kg: number): string {
  const lbs = Math.round(kg * 2.205);
  return `${lbs}lbs (${kg}kg)`;
}
