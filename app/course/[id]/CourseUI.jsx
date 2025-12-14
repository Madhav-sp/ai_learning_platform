"use client";

import { useEffect, useState } from "react";
import CourseRoadmap from "../../components/CourseRoadmap";

/* ================================================= */
/* ================= MAIN COMPONENT ================= */
/* ================================================= */

export default function CourseUI({ course }) {
  const [theme, setTheme] = useState("dark");
  // const [view, setView] = useState("roadmap");
  // roadmap | content | flashcards | quiz

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [view, setView] = useState("content"); // content | flashcards | quiz

  const chapter = course.chapters[activeChapterIndex];
  const topic = chapter.topics[activeTopicIndex];

  return (
    <div
      data-theme={theme}
      className="flex min-h-screen"
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
          <h2 className="font-semibold text-lg">Course</h2>
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
          <div
            onClick={() => setView("roadmap")}
            className="cursor-pointer font-medium"
          >
            🗺 Roadmap
          </div>

          <div onClick={() => setView("flashcards")} className="cursor-pointer">
            📘 Flashcards
          </div>
          <div onClick={() => setView("quiz")} className="cursor-pointer">
            📝 Quiz
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 px-8 py-10">
        {/* ===== ARTICLE VIEW ===== */}
        {view === "content" && <ArticleView topic={topic} />}

        {/* ===== FLASHCARDS ===== */}
        {view === "flashcards" && (
          <FlashcardsSection
            flashcards={topic.flashcards}
            onExit={() => setView("content")}
          />
        )}

        {/* ===== QUIZ ===== */}
        {view === "quiz" && <QuizView quiz={topic.quiz} />}
        {view === "roadmap" && (
          <CourseRoadmap
            course={course}
            onSelectChapter={(chapterIndex) => {
              setActiveChapterIndex(chapterIndex);
              setActiveTopicIndex(0);
              setView("content");
            }}
          />
        )}
      </main>
    </div>
  );
}

/* ================================================= */
/* ================= ARTICLE VIEW ================== */
/* ================================================= */

// max-w-3xl space-y-6
function ArticleView({ topic }) {
  return (
    <div className="padded-article   mx-auto ">
      <h1 className="text-3xl font-semibold">{topic.title}</h1>

      {topic.content.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2 key={i} className="text-2xl font-semibold mt-8 mb-3">
                {b.text}
              </h2>
            );

          case "text":
            return <p key={i}>{b.text}</p>;

          case "list":
            return (
              <ul key={i} className="list-disc ml-6 space-y-1">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );

          case "code":
            return <CodeBlock key={i} code={b.code} />;

          case "output":
            return (
              <div
                key={i}
                className="border-l-4 p-4 rounded"
                style={{
                  borderColor: "var(--accent)",
                  background: "var(--bg-secondary)",
                }}
              >
                <strong>Output:</strong>
                <pre className="mt-2 text-sm">{b.text}</pre>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/* ================================================= */
/* ================= CODE BLOCK ==================== */
/* ================================================= */

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      <button
        onClick={copy}
        className="absolute right-2 top-2 text-xs px-2 py-1 rounded border"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-secondary)",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <pre
        className="p-4 rounded text-sm overflow-x-auto border"
        style={{
          background: "var(--code-bg)",
          borderColor: "var(--border)",
          color: "#e5e7eb",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ================================================= */
/* ================= QUIZ VIEW ===================== */
/* ================================================= */

function QuizView({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = quiz.reduce(
    (s, q, i) => (answers[i] === q.correctAnswer ? s + 1 : s),
    0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Quiz</h1>

      {quiz.map((q, i) => (
        <div
          key={i}
          className="border p-4 rounded"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-medium mb-2">
            {i + 1}. {q.question}
          </p>

          {q.options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={`q-${i}`}
                disabled={submitted}
                onChange={() => setAnswers({ ...answers, [i]: opt })}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="px-4 py-2 rounded text-white"
          style={{ background: "var(--accent)" }}
        >
          Submit Quiz
        </button>
      ) : (
        <div className="text-lg font-medium">
          Score: {score} / {quiz.length}
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/* =============== FLASHCARDS (UNCHANGED) ========= */
/* ================================================= */

/* (Uses the same FlashcardsSection, FlashcardGrid,
   FlashcardStudy, FlipCard from previous message)
   → NO CHANGES REQUIRED THERE */
function FlashcardsSection({ flashcards, onExit }) {
  const [mode, setMode] = useState("grid"); // grid | study

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Flashcards</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Learn using active recall
          </p>
        </div>

        <div className="flex gap-3">
          {mode === "grid" ? (
            <button
              onClick={() => setMode("study")}
              className="px-4 py-2 rounded text-white"
              style={{ background: "var(--accent)" }}
            >
              ▶ Study Mode
            </button>
          ) : (
            <button
              onClick={() => setMode("grid")}
              className="px-4 py-2 rounded border"
              style={{ borderColor: "var(--border)" }}
            >
              ⬅ Back to Grid
            </button>
          )}

          <button
            onClick={onExit}
            className="px-4 py-2 rounded border"
            style={{ borderColor: "var(--border)" }}
          >
            ✖ Exit
          </button>
        </div>
      </div>

      {mode === "grid" ? (
        <FlashcardGrid flashcards={flashcards} />
      ) : (
        <FlashcardStudy flashcards={flashcards} />
      )}
    </>
  );
}

/* ================= GRID MODE ================= */

function FlashcardGrid({ flashcards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {flashcards.map((f, i) => (
        <FlipCard
          key={i}
          index={i}
          front={f.question}
          back={f.answer}
        />
      ))}
    </div>
  );
}

/* ================= STUDY MODE ================= */

function FlashcardStudy({ flashcards }) {
  const [cards, setCards] = useState(() =>
    [...flashcards].sort(() => Math.random() - 0.5)
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.code === "ArrowRight") next();
      if (e.code === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index]);

  const next = () => {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, cards.length - 1));
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  };

  const again = () => {
    setCards((prev) => [...prev, card]);
    next();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-[var(--text-muted)]">
        {index + 1} / {cards.length}
      </div>

      <div className="w-full max-w-md perspective">
        <div
          onClick={() => setFlipped(!flipped)}
          className={`relative h-64 cursor-pointer transition-transform duration-500 transform-style-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          <div
            className="absolute inset-0 rounded-xl border flex items-center justify-center p-6 backface-hidden shadow-lg"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-xl text-center">{card.question}</p>
          </div>

          <div
            className="absolute inset-0 rounded-xl flex items-center justify-center p-6 rotate-y-180 backface-hidden shadow-xl"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#000",
            }}
          >
            <p className="text-lg font-semibold text-center">
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={prev}
          className="px-4 py-2 rounded border"
          style={{ borderColor: "var(--border)" }}
        >
          ← Prev
        </button>

        <button
          onClick={again}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          Again
        </button>

        <button
          onClick={next}
          className="px-4 py-2 rounded bg-green-600 text-white"
        >
          Known
        </button>
      </div>

      <div className="text-xs text-[var(--text-muted)]">
        Space = flip · ← → = navigate
      </div>
    </div>
  );
}

/* ================= FLIP CARD ================= */

function FlipCard({ front, back, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective">
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative h-56 cursor-pointer transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div
          className="absolute inset-0 rounded-xl border flex flex-col justify-between p-5 backface-hidden shadow-lg"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <div className="text-xs text-[var(--text-muted)]">
            Card {index + 1}
          </div>
          <div className="text-lg font-medium text-center">
            {front}
          </div>
          <div className="text-xs text-center text-[var(--text-muted)]">
            Click to reveal
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center p-5 rotate-y-180 backface-hidden shadow-xl"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#000",
          }}
        >
          <p className="text-lg font-semibold text-center">
            {back}
          </p>
        </div>
      </div>
    </div>
  );
}