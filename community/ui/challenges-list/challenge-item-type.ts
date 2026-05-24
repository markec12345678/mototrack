export type ChallengeItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  status: string;
  endsAt: number;
  participants: number;
  joined?: boolean;
  progressPct?: number;
};
