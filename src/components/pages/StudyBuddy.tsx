import { useState } from "react";
import { Sparkles, RefreshCw, Layers, CheckSquare, ChevronLeft, ChevronRight, Check, X, HelpCircle } from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

interface MCQ {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export default function StudyBuddy() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"NONE" | "FLASHCARDS" | "QUIZ">("NONE");

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quiz, setQuiz] = useState<MCQ[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleGenerateFlashcards = async () => {
    if (!notes) return;
    setLoading(true);
    setMode("NONE");
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      setFlashcards(data);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setMode("FLASHCARDS");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!notes) return;
    setLoading(true);
    setMode("NONE");
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      setQuiz(data);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setMode("QUIZ");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qIndex]: optIndex,
    });
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          AI Study Buddy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
          Paste lecture scripts or PDF notes. Gemini extracts core definitions and designs study aids instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Notes Input panel (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">
              Enter Study Materials
            </h3>

            <div className="space-y-4">
              <textarea
                placeholder="Paste your compiler design notes, operating system slides, PDF text summaries, or lecture transcript here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs h-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleGenerateFlashcards}
                  disabled={loading || !notes}
                  className="flex-1 bg-white hover:bg-slate-50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  <span>Build Flashcards</span>
                </button>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={loading || !notes}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Active Study Screen / Results (7 cols) */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4 h-full min-h-[400px]">
              <div className="relative">
                <RefreshCw className="animate-spin h-10 w-10 text-indigo-600" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-violet-500 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Gemini is synthesizing definitions...
              </p>
              <p className="text-xs text-slate-450 max-w-xs">
                Generating structured flashcard blocks and MCQ evaluations from your pasted source notes.
              </p>
            </div>
          ) : mode === "NONE" ? (
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-12 text-center h-full min-h-[400px] flex flex-col items-center justify-center space-y-3">
              <HelpCircle className="h-8 w-8 text-indigo-400/80" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No session loaded</p>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Enter your syllabus materials on the left panel, then select Flashcards or Quiz generation to activate your intelligent workspace.
              </p>
            </div>
          ) : mode === "FLASHCARDS" ? (
            <div className="space-y-6">
              {/* Flashcard Viewer */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[350px]">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-4">
                    <span>FLASHCARD VIEW</span>
                    <span>
                      {currentCardIndex + 1} of {flashcards.length}
                    </span>
                  </div>

                  {/* Flippable Card Container */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer min-h-[180px] flex items-center justify-center p-6 border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-2xl relative transition-all duration-300 transform hover:scale-[1.01]"
                  >
                    {!isFlipped ? (
                      <div className="text-center space-y-3 animate-fade-in">
                        <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Question</p>
                        <p className="text-base font-semibold text-slate-800 dark:text-slate-100 px-4">
                          {flashcards[currentCardIndex]?.question}
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-4">Click card to reveal answer</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-3 animate-fade-in">
                        <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Answer / Concept</p>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 px-4 leading-relaxed">
                          {flashcards[currentCardIndex]?.answer}
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-4">Click card to flip back</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation controls */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => {
                      setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                      setIsFlipped(false);
                    }}
                    disabled={currentCardIndex === 0}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-4.5 w-4.5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <span className="text-xs text-slate-500 font-semibold">
                    {Math.round(((currentCardIndex + 1) / flashcards.length) * 100)}% Complete
                  </span>
                  <button
                    onClick={() => {
                      setCurrentCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
                      setIsFlipped(false);
                    }}
                    disabled={currentCardIndex === flashcards.length - 1}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="h-4.5 w-4.5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* QUIZ SCREEN */
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold pb-4 border-b border-slate-100 dark:border-slate-850">
                <span>AI INTERACTIVE SELF-EVALUATION QUIZ</span>
                {quizSubmitted && (
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    Score: {calculateScore()} / {quiz.length}
                  </span>
                )}
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
                {quiz.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        const isCorrect = q.correctOptionIndex === optIdx;

                        let cardStyle = "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300";
                        if (isSelected) {
                          cardStyle = "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold";
                        }
                        if (quizSubmitted) {
                          if (isCorrect) {
                            cardStyle = "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold";
                          } else if (isSelected) {
                            cardStyle = "border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold";
                          } else {
                            cardStyle = "border-slate-200 bg-slate-50/20 text-slate-400 opacity-60";
                          }
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex justify-between items-center ${cardStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <Check className="h-4 w-4 text-emerald-500" />}
                            {quizSubmitted && isSelected && !isCorrect && <X className="h-4 w-4 text-rose-500" />}
                          </div>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-850">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length < quiz.length}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-xs shadow-md disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Submit Self-Evaluation Answers
                </button>
              ) : (
                <button
                  onClick={handleGenerateQuiz}
                  className="w-full border border-indigo-200 hover:bg-indigo-50/20 dark:border-indigo-900/40 dark:hover:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400 py-3.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Generate Another Test Set
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
