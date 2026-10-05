export interface PlayerProfile {
  name: string;
  title: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  currency: number;
  playTime: string;
  locationsCount: { discovered: number; total: number };
  achievementsCount: { unlocked: number; total: number };
  stats: {
    exploration: number;
    missions: number;
    discovery: number;
    activities: number;
  };
  avatarImage: string;
  fullImage: string;
}

export const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  name: "HADHI",
  title: "Wayfarer",
  level: 1,
  currentXp: 320,
  nextLevelXp: 500,
  currency: 2450,
  playTime: "2h 15m",
  locationsCount: { discovered: 3, total: 50 },
  achievementsCount: { unlocked: 1, total: 100 },
  stats: {
    exploration: 40,
    missions: 20,
    discovery: 30,
    activities: 10,
  },
  avatarImage: "/images/hadhi_avatar.jpg",
  fullImage: "/images/character_hadhi.jpg",
};
