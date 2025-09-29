import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Session, type Identity, type QA } from "../session/sessionSlice";

export interface CandidateRecord {
  id: string;
  identity: Identity;
  qas: QA[];
  finalScore: number;
  summary: string;
  finishedAt: number;
}

interface CandidatesState {
  list: CandidateRecord[];
}

const initialState: CandidatesState = { list: [] };

function calcScore(qas: QA[]): number {
  if (qas.length === 0) return 0;
  const answeredCount = qas.filter((q) => !!q.answer).length;
  return Math.round((answeredCount / qas.length) * 100);
}

function generateSummary(identity: Identity, qas: QA[], score: number): string {
  const easy = qas.filter((q) => q.difficulty === "easy");
  const medium = qas.filter((q) => q.difficulty === "medium");
  const hard = qas.filter((q) => q.difficulty === "hard");

  const easyScore =
    easy.length > 0
      ? Math.round((easy.filter((q) => q.answer).length / easy.length) * 100)
      : 0;
  const mediumScore =
    medium.length > 0
      ? Math.round((medium.filter((q) => q.answer).length / medium.length) * 100)
      : 0;
  const hardScore =
    hard.length > 0
      ? Math.round((hard.filter((q) => q.answer).length / hard.length) * 100)
      : 0;

  let insight = "";
  if (hardScore >= 70) insight = "Strong in complex problem-solving.";
  else if (mediumScore >= 70) insight = "Solid in mid-level technical depth.";
  else if (easyScore >= 70) insight = "Good with fundamentals but needs depth.";
  else insight = "Needs significant improvement across all levels.";

  return `${identity.name} scored ${score}/100. ${insight}`;
}

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    archiveSession(state, action: PayloadAction<Session>) {
      const session = action.payload;
      if (session.step !== "completed" || !session.identity) return;

      const score = calcScore(session.qas);
      const summary = generateSummary(session.identity, session.qas, score);

      const newCandidate: CandidateRecord = {
        id: session.id,
        identity: session.identity,
        qas: session.qas,
        finalScore: score,
        summary,
        finishedAt: Date.now(),
      };

      state.list.push(newCandidate);
      state.list.sort((a, b) => b.finalScore - a.finalScore);
    },
  },
});

export const { archiveSession } = candidatesSlice.actions;
export default candidatesSlice.reducer;
