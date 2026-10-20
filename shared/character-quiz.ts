/**
 * Static character-quiz matches. The public page and the quiz procedure
 * both use this list, so a result never depends on a model call.
 */

export interface QuizQuestion {
  question: string;
  options: [string, string, string];
}

export interface QuizMatch {
  character: string;
  matchPercentage: number;
  personality: string;
  bookRecommendation: string;
  bookLink: string;
  reason: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What's your ideal date night?",
    options: [
      "Fancy dinner at a Michelin-star restaurant",
      "Adventure like skydiving or rock climbing",
      "Quiet night at home with wine and conversation",
    ],
  },
  {
    question: "What quality do you value most in a partner?",
    options: [
      "Ambition and success",
      "Spontaneity and fun",
      "Loyalty and depth",
    ],
  },
  {
    question: "How do you handle conflict?",
    options: [
      "Direct and decisive - address it immediately",
      "Avoid it with humor and distraction",
      "Take time to process, then discuss deeply",
    ],
  },
  {
    question: "What's your perfect vacation?",
    options: [
      "Luxury resort with spa and fine dining",
      "Backpacking through Europe",
      "Secluded cabin in the mountains",
    ],
  },
  {
    question: "What attracts you most?",
    options: [
      "Power and confidence",
      "Charm and wit",
      "Mystery and intensity",
    ],
  },
];

const MATCHES: Omit<QuizMatch, "matchPercentage">[] = [
  {
    character: "Michael Hastings",
    personality: "You look for someone decisive, ambitious, and steady once they commit.",
    bookRecommendation: "The Billionaire's Executive Assistant",
    bookLink: "https://www.amazon.com/dp/B0F2W8QL7S",
    reason: "A boss-and-assistant romance with a hero who values competence.",
  },
  {
    character: "David Kim",
    personality: "You like charm, a quick mind, and someone who can turn tension into a game.",
    bookRecommendation: "The Billionaire's Fake Wife",
    bookLink: "https://www.amazon.com/dp/B0FCCBNF8X",
    reason: "A contract-wife story: a marriage of convenience offered for protection.",
  },
  {
    character: "Dominic Kane",
    personality: "You want loyalty, depth, and someone who does not let go of what matters.",
    bookRecommendation: "The Billionaire's Baby Secret",
    bookLink: "https://www.amazon.com/dp/B0G12LBZ24",
    reason: "A second-chance romance about a family he is determined to keep.",
  },
];

/** Option order is Michael, David, then Dominic. Ties stay with the earlier match. */
export function scoreCharacterQuiz(answers: string[]): QuizMatch {
  const scores = [0, 0, 0];
  for (const answer of answers) {
    for (const question of QUIZ_QUESTIONS) {
      const index = question.options.indexOf(answer);
      if (index >= 0) {
        scores[index] += 1;
        break;
      }
    }
  }
  let best = 0;
  if (scores[1] > scores[best]) best = 1;
  if (scores[2] > scores[best]) best = 2;
  return {
    ...MATCHES[best],
    matchPercentage: Math.min(100, 70 + scores[best] * 6),
  };
}
