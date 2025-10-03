import { createSlice, type PayloadAction, nanoid } from "@reduxjs/toolkit";
import { callAI } from "../ai/aiService";
import { prompts } from "../ai/prompts";
import { mockGenerateQuestions } from "../ai/mockAI";
import { mockEvaluateAnswer, mockSummarize } from "../ai/mockAI";

export type Difficulty = "easy" | "medium" | "hard";

export type QA = {
  id: string;
  difficulty: Difficulty;
  question: string;
  answer?: string;
  secondsAllocated: number;
  secondsUsed?: number;
  autoSubmitted?: boolean;
  score?: number;        
  feedback?: string;     
};

export type Identity = {
 name: string;
  email: string;
  phone: string;
  gender?: string; 
  internship?: string;
  address?: string;
};

export type Session = {
  id: string;
  identity?: Identity;
  step: "collecting" | "interview" | "completed";
  qas: QA[];
  currentIndex: number;
  tick: {
    running: boolean;
    startedAt?: number;
    remaining?: number;
    allocated?: number;
  };
};

const DIFFS: Difficulty[] = ["easy", "easy", "medium", "medium", "hard", "hard"];
const BANK: Record<Difficulty, string[]> = {
  easy: ["Explain useEffect vs useLayoutEffect.", "What is the JS event loop?"],
  medium: ["Design a debounced search input.", "Why are keys important in React?"],
  hard: ["How to avoid jank in React rendering?", "Explain refresh token flow."],
};
const ALLOCATION = { easy: 20, medium: 60, hard: 120 };

const useMock = import.meta.env.VITE_USE_MOCK_AI === "true";

async function getQuestions() {
  if (useMock) return mockGenerateQuestions();
  const json = await callAI(prompts.generateQuestions);
  return JSON.parse(json);
}

function newQA(diff: Difficulty, i: number): QA {
  return {
    id: nanoid(),
    difficulty: diff,
    question: BANK[diff][i % BANK[diff].length],
    secondsAllocated: ALLOCATION[diff],
  };
}

export const loadQuestions = () => async (dispatch: any) => {
  const qs = await getQuestions();
  dispatch(setQuestions(qs));
};
export const evaluateCurrentAnswer =
  (id: string, answer: string) => async (dispatch: any, getState: any) => {
    dispatch(answerCurrent({ answer })); 

    const state: Session = getState().session;
    const q = state.qas.find((x) => x.id === id);
    if (!q) return;

    const { score, feedback } = await evaluateAnswer({ ...q, answer });
    dispatch(setEvaluation({ id, score, feedback }));
  };

export const finalizeInterview = () => async (dispatch: any, getState: any) => {
  const state: Session = getState().session;
  if (!state.identity) return;

  const summary = await summarizeInterview(state.identity, state.qas);
  console.log("AI Summary:", summary);

  dispatch(completeInterview()); 
};
const initialState: Session = {
  id: nanoid(),
  step: "collecting",
  qas: DIFFS.map((d, i) => newQA(d, i)),
  currentIndex: 0,
  tick: { running: false },
};
async function evaluateAnswer(q: QA): Promise<{ score: number; feedback: string }> {
  if (useMock) {
    const score = mockEvaluateAnswer(q);
    return { score, feedback: "Simulated feedback" };
  }

  const prompt = prompts.evaluateAnswer(q.question, q.answer ?? "");
  const result = await callAI(prompt);
  return JSON.parse(result) as { score: number; feedback: string };
}


async function summarizeInterview(identity: Identity, qas: QA[]): Promise<string> {
  if (useMock) return mockSummarize(identity.name, qas);

  const prompt = prompts.summarizeInterview(
    qas.map((q) => ({
      question: q.question,
      answer: q.answer ?? "",
      score: q.score ?? 0,
    }))
  );
  return await callAI(prompt);
}
const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    resetSession: () => initialState,
    setIdentity(state, action: PayloadAction<Identity>) {
      state.identity = action.payload;
      state.step = "interview";
    },
    setQuestions(state, action: PayloadAction<QA[]>) {
      state.qas = action.payload;
      state.currentIndex = 0;
      state.tick = { running: false };
    },
    startTimer(state) {
      const qa = state.qas[state.currentIndex];
      const base = state.tick.remaining ?? qa.secondsAllocated;
      state.tick = {
        running: true,
        remaining: base,
        allocated: qa.secondsAllocated,
        startedAt: Date.now(),
      };
    },
    tickDown(state) {
      if (!state.tick.running || !state.tick.startedAt) return;
      const elapsed = Math.floor((Date.now() - state.tick.startedAt) / 1000);
      const remaining = (state.tick.allocated ?? 0) - elapsed;
      state.tick.remaining = Math.max(0, remaining);
    },
 answerCurrent(
      state,
      action: PayloadAction<{ answer: string; auto?: boolean }>
    ) {
      const qa = state.qas[state.currentIndex];
      qa.answer = action.payload.answer;
      qa.autoSubmitted = !!action.payload.auto;
      qa.secondsUsed =
        qa.secondsAllocated - (state.tick.remaining ?? qa.secondsAllocated);

      state.currentIndex++;
      state.tick = { running: false };

      if (state.currentIndex >= state.qas.length) {
        state.step = "completed";
      }
    },
    setEvaluation(
      state,
      action: PayloadAction<{ id: string; score: number; feedback: string }>
    ) {
      const q = state.qas.find((qa) => qa.id === action.payload.id);
      if (q) {
        q.score = action.payload.score;
        q.feedback = action.payload.feedback;
      }
    },
     completeInterview(state) {
      state.step = "completed";
      state.tick = { running: false };
    },
  },
});

export const {
  resetSession,
  setIdentity,
  setQuestions,
  startTimer,
  tickDown,
  answerCurrent,
  setEvaluation,    
  completeInterview, 
} = sessionSlice.actions;

export default sessionSlice.reducer;
