export const prompts = {
  generateQuestions: `
    Generate 6 interview questions for a Full Stack React/Node.js developer.
    - 2 Easy
    - 2 Medium
    - 2 Hard
    Format as JSON:
    [{ "difficulty": "easy", "question": "..." }, ...]
  `,
  evaluateAnswer: (question: string, answer: string) => `
    Question: ${question}
    Answer: ${answer}
    Evaluate this answer on a scale of 0–10.
    Respond in JSON: { "score": number, "feedback": "short text" }
  `,
  summarizeInterview: (qas: { question: string; answer: string; score: number }[]) => `
    Summarize this candidate’s interview.
    Include strengths, weaknesses, and hiring recommendation.
    QAs: ${JSON.stringify(qas)}
  `,
};
