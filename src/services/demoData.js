export const demoUser = {
  username: "DemoUser",
  email: "demo@example.com",
};

export const demoHistory = [
  {
    category: "General Knowledge",
    difficulty: "easy",
    score: 8,
    total: 10,
    createdAt: "2024-10-01T12:00:00Z",
  },
  {
    category: "Science & Nature",
    difficulty: "medium",
    score: 7,
    total: 10,
    createdAt: "2024-10-05T15:30:00Z",
  },
  {
    category: "History",
    difficulty: "hard",
    score: 6,
    total: 12,
    createdAt: "2024-11-12T09:15:00Z",
  },
];

export const demoLeaderboard = {
  easy: [
    { username: "Nova", totalCorrect: 14, totalQuestions: 15 },
    { username: "Atlas", totalCorrect: 12, totalQuestions: 15 },
    { username: "Quinn", totalCorrect: 11, totalQuestions: 15 },
  ],
  medium: [
    { username: "Riley", totalCorrect: 10, totalQuestions: 15 },
    { username: "Mira", totalCorrect: 9, totalQuestions: 15 },
    { username: "Kai", totalCorrect: 8, totalQuestions: 15 },
  ],
  hard: [
    { username: "Indigo", totalCorrect: 8, totalQuestions: 15 },
    { username: "Sage", totalCorrect: 7, totalQuestions: 15 },
    { username: "Rowan", totalCorrect: 6, totalQuestions: 15 },
  ],
};
