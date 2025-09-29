import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

import sessionReducer from "../features/session/sessionSlice";
import candidatesReducer from "../features/candidates/candidatesSlice";

const rootReducer = combineReducers({
  session: sessionReducer,
  candidates: candidatesReducer,
});

export const persistConfig = {
  key: "swipe-interview",
  version: 1,
  storage,
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
