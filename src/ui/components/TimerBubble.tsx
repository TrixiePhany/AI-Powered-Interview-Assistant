import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";

export default function TimerBubble() {
  const { qas, currentIndex, tick } = useSelector((s: RootState) => s.session);
  const qa = qas[currentIndex];
  if (!qa) return null;

  const remaining = tick.remaining ?? qa.secondsAllocated;

  return (
    <div className="fixed bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-full shadow">
      ⏳ {remaining}s
    </div>
  );
}
