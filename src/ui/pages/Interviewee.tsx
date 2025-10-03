import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../app/store";
import Uploader from "../components/Uploader";
import { answerCurrent } from "../../features/session/sessionSlice";
import { useQuestionTimer } from "../../features/session/useQuestionTimer";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TypingDots from "../components/TypingDots";
import Confetti from "react-confetti";

const UploaderView = () => (
  <div className="p-8">
    <div className="flex flex-col justify-center items-start w-[50vw] h-[70vh] mx-auto my-auto bg-white rounded-xl shadow-lg border">
      <h2 className="text-3xl font-bold pl-3 text-gray-700">Upload Resume</h2>
      <p className="text-gray-600 pl-3 mb-4">
        Please upload your resume to start the interview.
      </p>
      <Uploader />
    </div>
  </div>
);

const chatMessageVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const userMessageVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const completedVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

export default function Interviewee() {
  const dispatch = useDispatch();
  const session = useSelector((s: RootState) => s.session);

  useQuestionTimer();
  const [userAnswer, setUserAnswer] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [session.currentIndex, session.qas.map((q) => q.answer).join(), typing]);

  // Typing simulation
  useEffect(() => {
    if (session.step !== "interview") return;
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(t);
  }, [session.currentIndex]);

  // Confetti trigger
  useEffect(() => {
    if (session.step === "completed") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [session.step]);

  if (session.step === "collecting") {
    return <UploaderView />;
  }

  if (session.step === "interview") {
    const progress = ((session.currentIndex + 1) / session.qas.length) * 100;
    const currentQA = session.qas[session.currentIndex];
    const remaining = session.tick.remaining ?? currentQA.secondsAllocated;
    const isLastQuestion = session.currentIndex === session.qas.length - 1;

    return (
      <div className="flex flex-col h-[90vh] max-w-4xl mx-auto my-8 border border-gray-300 rounded-xl shadow-lg bg-white overflow-hidden">
        {/* Top bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>Interview Progress</span>
            <span>
              Question {session.currentIndex + 1} of {session.qas.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                currentQA.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : currentQA.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {currentQA.difficulty}
            </span>
            <span className="font-mono text-lg text-gray-700">
              {Math.floor(remaining / 60)}:
              {(remaining % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Chat history */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
          {session.qas.slice(0, session.currentIndex + 1).map((qa, idx) => (
            <div key={qa.id}>
              {/* BOT */}
              <motion.div
                variants={chatMessageVariants}
                initial="hidden"
                animate="visible"
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  BOT
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-lg">
                  <p className="text-gray-800">{qa.question}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>

              {/* YOU */}
              {qa.answer && (
                <motion.div
                  variants={userMessageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-3 justify-end mt-4"
                >
                  <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-sm max-w-lg">
                    <p>{qa.answer}</p>
                    <span className="text-xs text-indigo-200 mt-2 block">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    YOU
                  </div>
                </motion.div>
              )}

              {/* Answer input */}
              {idx === session.currentIndex && !qa.answer && !typing && (
                <div className="mt-4 p-4 bg-white border rounded-lg shadow-inner">
                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                    placeholder="Type your answer here..."
                    rows={3}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                      onClick={() => {
                        dispatch(answerCurrent({ answer: userAnswer }));
                        setUserAnswer("");
                      }}
                      disabled={!userAnswer.trim()}
                    >
                      {isLastQuestion ? "Finalize" : "Send"}
                    </button>
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {idx === session.currentIndex && !qa.answer && typing && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    BOT
                  </div>
                  <TypingDots />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (session.step === "completed") {
    return (
      <motion.div
        variants={completedVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center justify-center h-[80vh] bg-white rounded-xl shadow-2xl p-8 max-w-lg mx-auto my-auto"
      >
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        <h2 className="text-5xl font-bold">🎉</h2>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Interview Complete!</h2>
        <p className="text-gray-600 text-center">
          Thank you for completing the interview. Your results are being processed.
        </p>
      </motion.div>
    );
  }

  return null;
}
