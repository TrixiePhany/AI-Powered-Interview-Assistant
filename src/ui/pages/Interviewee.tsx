import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../app/store";
import Uploader from "../components/Uploader";
import { answerCurrent } from "../../features/session/sessionSlice";
import { useQuestionTimer } from "../../features/session/useQuestionTimer";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TypingDots from "../components/TypingDots";


const UploaderView = () => (
  <div className="p-10"> 
  <div className=" items-center border border-6px w-[60vw] h-[60vh] mx-auto my-auto bg-gray-900 rounded-xl shadow-lg">
    <h2 className="text-3xl font-bold text-gray-100">Upload Resume</h2>
    <p className="text-gray-400  text-left">
      Please upload your resume to start the interview.
      <Uploader />
    </p>
    
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

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [session.currentIndex, session.qas.map((q) => q.answer).join(), typing]);

  useEffect(() => {
    if (session.step !== "interview") return;
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(t);
  }, [session.currentIndex]);

  if (session.step === "collecting") {
    return <UploaderView />;
  }

  if (session.step === "interview") {
    const progress = ((session.currentIndex + 1) / session.qas.length) * 100;
    const currentQA = session.qas[session.currentIndex];
    const remaining = session.tick.remaining ?? currentQA.secondsAllocated;
    const isLastQuestion = session.currentIndex === session.qas.length - 1;

    return (
      <div className="flex flex-col h-[90vh] max-w-4xl mx-auto my-8 border border-gray-700 rounded-2xl shadow-2xl bg-gray-900 overflow-hidden">
        {/* Top bar */}
        <div className="p-6 border-b border-gray-700 bg-gray-950">
          <div className="flex justify-between items-center mb-3 text-sm text-gray-400">
            <span className="font-medium">Interview Progress</span>
            <span>
              Question {session.currentIndex + 1} of {session.qas.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-2 bg-indigo-500 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                currentQA.difficulty === "easy"
                  ? "bg-green-500/20 text-green-400"
                  : currentQA.difficulty === "medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {currentQA.difficulty}
            </span>
            <span className="font-mono text-xl text-gray-100">
              ⏱ {Math.floor(remaining / 60)}:
              {(remaining % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Chat history */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {session.qas.slice(0, session.currentIndex + 1).map((qa, idx) => (
            <div key={qa.id}>
              {/* AI Question */}
              <motion.div
                variants={chatMessageVariants}
                initial="hidden"
                animate="visible"
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xl text-gray-300 flex-shrink-0">
                  🤖
                </div>
                <div className="bg-gray-800 p-4 rounded-xl rounded-tl-none max-w-lg shadow-sm">
                  <p className="text-gray-200 leading-relaxed">{qa.question}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>

              {/* Candidate Answer */}
              {qa.answer && (
                <motion.div
                  variants={userMessageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-3 justify-end mt-4"
                >
                  <div className="bg-indigo-600 text-white p-4 rounded-xl rounded-tr-none max-w-lg shadow-sm">
                    <p className="leading-relaxed">{qa.answer}</p>
                    <span className="text-xs text-indigo-200 mt-2 block">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-indigo-700 flex items-center justify-center text-xl flex-shrink-0">
                    🙋
                  </div>
                </motion.div>
              )}

              {/* Input box for current Q */}
              {idx === session.currentIndex && !qa.answer && !typing && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-inner">
                  <textarea
                    className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border-2 border-gray-700 focus:border-indigo-500 focus:outline-none resize-none transition-colors"
                    placeholder="Type your answer here..."
                    rows={3}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-transform duration-200 hover:scale-105"
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

              {idx === session.currentIndex && !qa.answer && typing && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xl text-gray-300 flex-shrink-0">
                    🤖
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
        className="flex flex-col items-center justify-center h-[60vh] text-gray-100 bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md mx-auto my-auto"
      >
        <div className="text-6xl mb-6 animate-pulse">🎉</div>
        <p className="text-2xl font-bold mb-2 text-center">Interview Complete!</p>
        <p className="text-gray-400 text-center">
          Thank you for completing the interview. Your results are being
          processed.
        </p>
      </motion.div>
    );
  }

  return null;
}

