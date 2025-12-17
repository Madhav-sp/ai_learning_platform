"use client";

import { useEffect, useState } from "react";
import CourseRoadmap from "../../components/CourseRoadmap";

/* ================================================= */
/* ================= MAIN COMPONENT ================= */
/* ================================================= */

export default function CourseUI({ course }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [view, setView] = useState("content"); // content | flashcards | quiz | roadmap

  const chapter = course.chapters[activeChapterIndex];
  const topic = chapter.topics[activeTopicIndex];

  return (
    <div className="flex min-h-screen bg-[#0b0b0c] text-gray-300">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-80 bg-[#0e0e10] border-r border-white/5 px-5 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-sm uppercase tracking-widest text-gray-400">
            Course
          </h2>
          <p className="text-lg font-medium text-gray-200 mt-1">
            {course.title}
          </p>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          {course.chapters.map((ch, ci) => (
            <div key={ci}>
              <button
                onClick={() => {
                  setActiveChapterIndex(ci);
                  setActiveTopicIndex(0);
                  setView("content");
                }}
                className={`w-full text-left text-sm font-medium transition-colors ${
                  ci === activeChapterIndex
                    ? "text-orange-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {ci + 1}. {ch.chapterTitle}
              </button>

              {ci === activeChapterIndex && (
                <div className="mt-2 ml-4 space-y-1">
                  {ch.topics.map((t, ti) => (
                    <button
                      key={ti}
                      onClick={() => {
                        setActiveTopicIndex(ti);
                        setView("content");
                      }}
                      className={`block w-full text-left text-sm transition-colors ${
                        ti === activeTopicIndex
                          ? "text-gray-200"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/5" />

        {/* Utilities */}
        <div className="space-y-2 text-sm">
          <button
            onClick={() => setView("roadmap")}
            className="block w-full text-left text-gray-400 hover:text-gray-200"
          >
            Course Roadmap
          </button>
          <button
            onClick={() => setView("flashcards")}
            className="block w-full text-left text-gray-400 hover:text-gray-200"
          >
            Flashcards
          </button>
          <button
            onClick={() => setView("quiz")}
            className="block w-full text-left text-gray-400 hover:text-gray-200"
          >
            Quiz
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 px-10 py-10">
        {view === "content" && <ArticleView topic={topic} />}
        {view === "flashcards" && (
          <FlashcardsSection
            flashcards={topic.flashcards}
            onExit={() => setView("content")}
          />
        )}
        {view === "quiz" && <QuizView quiz={topic.quiz} />}
        {view === "roadmap" && (
          <CourseRoadmap
            course={course}
            onSelectChapter={(i) => {
              setActiveChapterIndex(i);
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

function ArticleView({ topic }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold text-gray-100">{topic.title}</h1>

      {topic.content.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2 key={i} className="text-xl font-semibold text-gray-200 pt-6">
                {b.text}
              </h2>
            );

          case "text":
            return (
              <p key={i} className="text-gray-400 leading-relaxed">
                {b.text}
              </p>
            );

          case "list":
            return (
              <ul key={i} className="list-disc ml-6 space-y-1 text-gray-400">
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
                className="border-l-2 pl-4 py-2 bg-[#111113]"
                style={{ borderColor: "#f97316" }}
              >
                <pre className="text-sm text-gray-300">{b.text}</pre>
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
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative">
      <button
        onClick={copy}
        className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-200"
      >
        {copied ? "Copied" : "Copy"}
      </button>

      <pre className="bg-[#111113] border border-white/5 rounded-xl p-5 text-sm text-gray-200 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ================================================= */
/* ================= QUIZ VIEW ===================== */
/* ================================================= */

// function QuizView({ quiz }) {
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   const score = quiz.reduce(
//     (s, q, i) => (answers[i] === q.correctAnswer ? s + 1 : s),
//     0
//   );

//   return (
//     <div className="max-w-3xl mx-auto space-y-6">
//       <h1 className="text-2xl font-semibold text-gray-100">Quiz</h1>

//       {quiz.map((q, i) => (
//         <div
//           key={i}
//           className="border border-white/5 bg-[#111113] rounded-xl p-5"
//         >
//           <p className="text-gray-200 mb-3">
//             {i + 1}. {q.question}
//           </p>

//           {q.options.map((opt) => (
//             <label key={opt} className="block text-sm text-gray-400">
//               <input
//                 type="radio"
//                 name={`q-${i}`}
//                 disabled={submitted}
//                 onChange={() => setAnswers({ ...answers, [i]: opt })}
//                 className="mr-2"
//               />
//               {opt}
//             </label>
//           ))}
//         </div>
//       ))}

//       {!submitted ? (
//         <button
//           onClick={() => setSubmitted(true)}
//           className="px-5 py-2 rounded-lg bg-orange-500 text-black text-sm font-medium"
//         >
//           Submit
//         </button>
//       ) : (
//         <p className="text-gray-200">
//           Score: {score} / {quiz.length}
//         </p>
//       )}
//     </div>
//   );
// }


function QuizView({ quiz }) {
  const QUIZ_TIME_SECONDS = 5 * 60; // 5 minutes (change if needed)

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);

  // score calculation
  const score = quiz.reduce(
    (s, q, i) => (answers[i] === q.correctAnswer ? s + 1 : s),
    0
  );

  // timer logic
  useEffect(() => {
    if (!started || submitted) return;

    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, submitted, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ================= PRE-QUIZ SCREEN ================= */

  if (!started) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-lg w-full bg-[#0f0f12] border border-white/5 rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-semibold text-gray-100 mb-3">
            Ready for the Quiz?
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            You’ll have {QUIZ_TIME_SECONDS / 60} minutes to complete this quiz.
            Once started, the timer cannot be paused.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 rounded-lg bg-orange-500 text-black text-sm font-medium"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  /* ================= RESULT SCREEN ================= */

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-lg w-full bg-[#0f0f12] border border-white/5 rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-semibold text-gray-100 mb-3">
            Quiz Completed
          </h1>
          <p className="text-gray-400 mb-6">
            Your Score
          </p>

          <div className="text-4xl font-semibold text-orange-400 mb-6">
            {score} / {quiz.length}
          </div>

          <p className="text-sm text-gray-500">
            Time taken: {formatTime(QUIZ_TIME_SECONDS - timeLeft)}
          </p>
        </div>
      </div>
    );
  }

  /* ================= QUIZ SCREEN ================= */

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-gray-300 px-10 py-8">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-gray-100">
          Quiz
        </h1>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-lg bg-[#111113] border border-white/5 text-sm">
            ⏱ {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:text-white"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-5xl mx-auto space-y-6">
        {quiz.map((q, i) => (
          <div
            key={i}
            className="bg-[#111113] border border-white/5 rounded-2xl p-6"
          >
            <p className="text-gray-200 mb-4">
              {i + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === opt}
                    onChange={() =>
                      setAnswers({ ...answers, [i]: opt })
                    }
                    className="accent-orange-500"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ================================================= */
/* ================= FLASHCARDS ==================== */
/* ================================================= */

// function FlashcardsSection({ flashcards, onExit }) {
//   const [mode, setMode] = useState("grid");

//   return (
//     <>
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-100">Flashcards</h1>
//           <p className="text-sm text-gray-500">Active recall learning</p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => setMode(mode === "grid" ? "study" : "grid")}
//             className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-gray-100"
//           >
//             {mode === "grid" ? "Study mode" : "Grid view"}
//           </button>

//           <button
//             onClick={onExit}
//             className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300"
//           >
//             Exit
//           </button>
//         </div>
//       </div>

//       {mode === "grid" ? (
//         <FlashcardGrid flashcards={flashcards} />
//       ) : (
//         <FlashcardStudy flashcards={flashcards} />
//       )}
//     </>
//   );
// }

// /* ================= GRID MODE ================= */

// function FlashcardGrid({ flashcards }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//       {flashcards.map((f, i) => (
//         <FlipCard key={i} index={i} front={f.question} back={f.answer} />
//       ))}
//     </div>
//   );
// }

// /* ================= STUDY MODE ================= */

// function FlashcardStudy({ flashcards }) {
//   const [cards, setCards] = useState([...flashcards]);
//   const [index, setIndex] = useState(0);
//   const [flipped, setFlipped] = useState(false);

//   const card = cards[index];

//   const next = () => {
//     setFlipped(false);
//     setIndex((i) => Math.min(i + 1, cards.length - 1));
//   };

//   const prev = () => {
//     setFlipped(false);
//     setIndex((i) => Math.max(i - 1, 0));
//   };

//   return (
//     <div className="flex flex-col items-center gap-6">
//       <div className="text-sm text-gray-500">
//         {index + 1} / {cards.length}
//       </div>

//       <div
//         onClick={() => setFlipped(!flipped)}
//         className="w-full max-w-md h-64 cursor-pointer"
//       >
//         <div className="bg-[#111113] border border-white/5 rounded-xl h-full flex items-center justify-center p-6">
//           <p className="text-lg text-center text-gray-200">
//             {flipped ? card.answer : card.question}
//           </p>
//         </div>
//       </div>

//       <div className="flex gap-4">
//         <button
//           onClick={prev}
//           className="px-4 py-2 rounded-lg border border-white/10 text-sm"
//         >
//           Prev
//         </button>
//         <button
//           onClick={next}
//           className="px-4 py-2 rounded-lg bg-orange-500 text-black text-sm"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ================= FLIP CARD ================= */

// function FlipCard({ front, back, index }) {
//   const [flipped, setFlipped] = useState(false);

//   return (
//     <div
//       onClick={() => setFlipped(!flipped)}
//       className="bg-[#111113] border border-white/5 rounded-xl p-5 cursor-pointer hover:border-orange-500/20 transition-colors"
//     >
//       <div className="text-xs text-gray-500 mb-2">Card {index + 1}</div>
//       <div className="text-gray-200 text-center">{flipped ? back : front}</div>
//     </div>
//   );
// }

function FlashcardsSection({ flashcards, onExit }) {
  const [mode, setMode] = useState("grid");

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Flashcards</h1>
          <p className="text-sm text-gray-500">Active recall learning</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setMode(mode === "grid" ? "study" : "grid")}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-gray-100"
          >
            {mode === "grid" ? "Study mode" : "Grid view"}
          </button>

          <button
            onClick={onExit}
            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300"
          >
            Exit
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
function FlashcardGrid({ flashcards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {flashcards.map((f, i) => (
        <FlipCard key={i} index={i} front={f.question} back={f.answer} />
      ))}
    </div>
  );
}
function FlashcardStudy({ flashcards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[index];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-sm text-gray-500">
        {index + 1} / {flashcards.length}
      </div>

      {/* Fixed-size flip card */}
      <div
        className="w-full max-w-xl h-[320px] perspective"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-2xl bg-[#111113] border border-white/10 flex items-center justify-center p-10">
            <p className="text-xl text-center text-gray-200 leading-relaxed">
              {card.question}
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl 
                          bg-orange-500/90 text-black flex items-center justify-center p-10"
          >
            <p className="text-xl font-medium text-center leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setFlipped(false);
            setIndex((i) => Math.max(i - 1, 0));
          }}
          className="px-5 py-2 rounded-lg border border-white/10 text-sm"
        >
          Prev
        </button>

        <button
          onClick={() => {
            setFlipped(false);
            setIndex((i) => Math.min(i + 1, flashcards.length - 1));
          }}
          className="px-5 py-2 rounded-lg bg-orange-500 text-black text-sm font-medium"
        >
          Next
        </button>
      </div>

      <p className="text-xs text-gray-500">Click the card to flip</p>
    </div>
  );
}
function FlipCard({ front, back, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="h-[260px] perspective cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl 
                        bg-[#111113] border border-white/5 p-6 flex flex-col justify-between"
        >
          <div className="text-xs text-gray-500">Card {index + 1}</div>

          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-200 text-center">{front}</p>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Click to reveal
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl 
                        bg-orange-500/90 text-black p-6 flex items-center justify-center"
        >
          <p className="text-lg font-medium text-center">{back}</p>
        </div>
      </div>
    </div>
  );
}
