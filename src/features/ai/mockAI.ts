import { type QA } from "../session/sessionSlice";


export function mockGenerateQuestions(): QA[] {
  return [
    { id: "1", question: "What is React?", difficulty: "easy", secondsAllocated: 60 },
    { id: "2", question: "Explain useEffect hook.", difficulty: "easy", secondsAllocated: 60 },
    { id: "3", question: "What is middleware in Node.js?", difficulty: "medium", secondsAllocated: 90 },
    { id: "4", question: "Explain JWT authentication.", difficulty: "medium", secondsAllocated: 90 },
    { id: "5", question: "How does React Fiber work?", difficulty: "hard", secondsAllocated: 120 },
    { id: "6", question: "Explain event loop in Node.js.", difficulty: "hard", secondsAllocated: 120 },
  ];
}

export function mockEvaluateAnswer(q: QA): number {
  return q.answer ? Math.floor(Math.random() * 10) + 1 : 0;
}

export function mockSummarize(name: string, qas: QA[]): string {
  const score = Math.round(
    (qas.filter((q) => q.answer).length / qas.length) * 100
  );
  return `${name} completed the interview with ${score}/100. (simulated AI)`;
}
