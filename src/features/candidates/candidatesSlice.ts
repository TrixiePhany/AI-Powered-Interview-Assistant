import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Session } from "../session/sessionSlice";
import { seedCandidates } from "./seedCandidates";

export type CandidateRecord = {
  id: string;
  identity: {
    name: string;
    email: string;
    phone: string;
    internship?: string;
  };
  qas: {
    question: string;
    answer?: string;
    difficulty?: string;
    secondsAllocated?: number;
    secondsUsed?: number;
    autoSubmitted?: boolean;
  }[];
  finalScore: number;
  summary: string;
  finishedAt: number;
  demo?: boolean; 
};

type State = { list: CandidateRecord[] };

const initialState: State = {
  list: seedCandidates(),
};

function calcScore(qas: CandidateRecord["qas"]): number {
  const answered = qas.filter((q) => q.answer);
  if (answered.length === 0) return 0;
  return Math.round((answered.length / qas.length) * 100);
}

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    archiveSession(state, action: PayloadAction<Session>) {
      const s = action.payload;
      if (s.step !== "completed" || !s.identity) return;

      const score = calcScore(s.qas);

      state.list.push({
        id: s.id,
        identity: s.identity,
        qas: s.qas,
        finalScore: score,
        summary: `${s.identity.name} scored ${score}/100`,
        finishedAt: Date.now(),
      });

      state.list.sort((a, b) => b.finalScore - a.finalScore);
    },

    clearCandidates(state) {
      state.list = [];
    },
  },
});

export const { archiveSession, clearCandidates } = candidatesSlice.actions;
export default candidatesSlice.reducer;
