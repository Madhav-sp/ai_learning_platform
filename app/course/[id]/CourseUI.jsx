"use client";

import { useEffect, useState } from "react";

export default function CourseUI({ course }) {
  const [theme, setTheme] = useState("light");

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [view, setView] = useState("content"); // content | flashcards | quiz

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeInput, setTimeInput] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const chapter = course.chapters[activeChapterIndex];
  const topic = chapter.topics[activeTopicIndex];

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  useEffect(() => {
    if (quizStarted && timeLeft === 0) submitQuiz();
  }, [timeLeft]);

  const startQuiz = () => {
    setAnswers({});
    setResult(null);
    setTimeLeft(timeInput * 60);
    setQuizStarted(true);
  };

  const submitQuiz = () => {
    let score = 0;
    topic.quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    setResult({ score, total: topic.quiz.length });
    setQuizStarted(false);
  };

  return (
    <div
      data-theme={theme}
      className="flex min-h-screen transition-colors duration-300"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* ================= SIDEBAR ================= */}
      <aside
        className="w-80 p-4 border-r"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Course</h2>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-sm px-3 py-1 rounded border"
            style={{ borderColor: "var(--border)" }}
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        {course.chapters.map((ch, ci) => (
          <div key={ci} className="mb-3">
            <div
              onClick={() => {
                setActiveChapterIndex(ci);
                setActiveTopicIndex(0);
                setView("content");
              }}
              className="cursor-pointer font-medium"
              style={{
                color:
                  ci === activeChapterIndex
                    ? "var(--accent)"
                    : "var(--text-muted)",
              }}
            >
              {ci + 1}. {ch.chapterTitle}
            </div>

            {ci === activeChapterIndex && (
              <div className="ml-4 mt-1 space-y-1 text-sm">
                {ch.topics.map((t, ti) => (
                  <div
                    key={ti}
                    onClick={() => {
                      setActiveTopicIndex(ti);
                      setView("content");
                    }}
                    className="cursor-pointer"
                    style={{
                      color:
                        ti === activeTopicIndex
                          ? "var(--accent)"
                          : "var(--text-muted)",
                    }}
                  >
                    • {t.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-6 border-t pt-4 space-y-2">
          <div onClick={() => setView("flashcards")} className="cursor-pointer">
            📘 Flashcards
          </div>
          <div onClick={() => setView("quiz")} className="cursor-pointer">
            📝 Quiz
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 max-w-5xl">
        {/* ===== CONTENT ===== */}
        {view === "content" && (
          <>
            <h1 className="text-3xl font-semibold mb-6">{topic.title}</h1>

            <div className="space-y-4 leading-7">
              {topic.content.map((b, i) => {
                if (b.type === "heading")
                  return (
                    <h2 key={i} className="text-xl font-semibold">
                      {b.text}
                    </h2>
                  );

                if (b.type === "text") return <p key={i}>{b.text}</p>;

                if (b.type === "list")
                  return (
                    <ul key={i} className="list-disc ml-6">
                      {b.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  );

                if (b.type === "code")
                  return (
                    <pre
                      key={i}
                      className="p-4 rounded text-sm overflow-x-auto border"
                      style={{
                        background: "var(--code-bg)",
                        borderColor: "var(--border)",
                        color: "#e5e7eb", // FIXED VISIBILITY
                      }}
                    >
                      <code>{b.code}</code>
                    </pre>
                  );

                if (b.type === "output")
                  return (
                    <div
                      key={i}
                      className="border-l-4 p-3 rounded"
                      style={{
                        borderColor: "var(--accent)",
                        background: "var(--bg-secondary)",
                      }}
                    >
                      <strong>Output:</strong>
                      <pre className="mt-2 text-sm">{b.text}</pre>
                    </div>
                  );
              })}
            </div>
          </>
        )}

        {/* ===== FLASHCARDS ===== */}
        {view === "flashcards" && (
          <>
            <h1 className="text-2xl font-semibold mb-6">Flashcards</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {topic.flashcards.map((f, i) => (
                <FlipCard key={i} front={f.question} back={f.answer} />
              ))}
            </div>
          </>
        )}

        {/* ===== QUIZ ===== */}
        {view === "quiz" && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Quiz</h1>

            {!quizStarted && !result && (
              <>
                <input
                  type="number"
                  min="1"
                  value={timeInput}
                  onChange={(e) => setTimeInput(Number(e.target.value))}
                  className="border p-2 rounded w-32"
                />
                <button
                  onClick={startQuiz}
                  className="ml-4 px-4 py-2 rounded text-white"
                  style={{ background: "var(--accent)" }}
                >
                  Start Quiz
                </button>
              </>
            )}

            {quizStarted &&
              topic.quiz.map((q, i) => (
                <div key={i} className="mt-4">
                  <p className="font-medium">
                    {i + 1}. {q.question}
                  </p>
                  {q.options.map((opt) => (
                    <label key={opt} className="block">
                      <input
                        type="radio"
                        name={`q-${i}`}
                        onChange={() =>
                          setAnswers({
                            ...answers,
                            [i]: opt,
                          })
                        }
                      />{" "}
                      {opt}
                    </label>
                  ))}
                </div>
              ))}

            {quizStarted && (
              <button
                onClick={submitQuiz}
                className="mt-4 px-4 py-2 rounded text-white"
                style={{ background: "var(--accent)" }}
              >
                Submit Quiz
              </button>
            )}

            {result && (
              <div className="mt-6 font-medium">
                Score: {result.score}/{result.total}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ================= FLIP CARD ================= */
function FlipCard({ front, back }) {
  const [flip, setFlip] = useState(false);

  return (
    <div
      onClick={() => setFlip(!flip)}
      className="h-48 cursor-pointer perspective"
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 transform-style-3d ${
          flip ? "rotate-y-180" : ""
        }`}
      >
        <div
          className="absolute inset-0 p-4 border rounded backface-hidden flex items-center justify-center text-center"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          {front}
        </div>

        <div
          className="absolute inset-0 p-4 rounded backface-hidden rotate-y-180 flex items-center justify-center text-center"
          style={{
            background: "var(--accent)",
            color: "#000",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
