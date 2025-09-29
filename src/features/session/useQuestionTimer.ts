import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {type  RootState } from "../../app/store";
import { startTimer, tickDown, answerCurrent } from "./sessionSlice";

export function useQuestionTimer() {
  const dispatch = useDispatch();
  const { step, currentIndex, qas, tick } = useSelector((s: RootState) => s.session);

  useEffect(() => {
    if (step !== "interview" || currentIndex >= qas.length) return;
    if (!tick.running) {
      dispatch(startTimer());
    }

    const interval = setInterval(() => {
      dispatch(tickDown());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, step, currentIndex, qas.length, tick.running]);

  useEffect(() => {
    if (step !== "interview" || currentIndex >= qas.length) return;
    if (tick.remaining === 0) {
      dispatch(answerCurrent({ answer: "", auto: true }));
    }
  }, [tick.remaining, step, currentIndex, qas.length, dispatch]);
}

