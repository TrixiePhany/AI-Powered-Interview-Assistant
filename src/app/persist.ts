import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

import sessionReducer from "../features/session/sessionSlice";
import candidatesReducer, { type CandidateRecord } from "../features/candidates/candidatesSlice";
import { seedCandidates } from "../features/candidates/seedCandidates";

const rootReducer = combineReducers({
  session: sessionReducer,
  candidates: candidatesReducer,
});

export const persistConfig = {
  key: "swipe-interview",
  version: 1,
  storage,
  migrate: async (state: any) => {
    if (!state?.candidates?.list || state.candidates.list.length === 0) {
      return {
        ...state,
        candidates: { list: seedCandidates() as CandidateRecord[] },
      };
    }
    return state;
  },
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
