import { type CandidateRecord } from "./candidatesSlice";

export function seedCandidates(): CandidateRecord[] {
  return [
    {
      id: "1",
      identity: {
        name: "Nibhriti Sarkar",
        email: "nibhritisarkar@mail.com",
        phone: "999-123-4567",
        internship: "Frontend Intern",
      },
      qas: [],
      finalScore: 85,
      summary: "Nibhriti showed strong fundamentals and problem-solving skills.",
      finishedAt: Date.now() - 100000,
    },
    {
      id: "2",
      identity: {
        name: "Nayanika Chatterjee",
        email: "nayanikac@mail.com",
        phone: "999-987-6543",
        internship: "AI Intern",
      },
      qas: [],
      finalScore: 72,
      summary:
        "Nayanika is good with React hooks but needs improvement in system design.",
      finishedAt: Date.now() - 50000,
    },
    {
      id: "3",
      identity: {
        name: "Nimisha Sarkar",
        email: "nimishasarkar@mail.com",
        phone: "777-555-2222",
        internship: "Backend Intern",
      },
      qas: [],
      finalScore: 64,
      summary:
        "Nimisha has solid backend knowledge but struggled with advanced React.",
      finishedAt: Date.now() - 20000,
    },
  ];
}
