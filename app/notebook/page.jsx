"use client";
import { useEffect, useState } from "react";

/* =====================================================
   NOTEBOOK PAGE (Netflix-style Library + Viewer + Chat)
   ===================================================== */

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [activeView, setActiveView] = useState("summary");
  const [loading, setLoading] = useState(false);

  // Fetch all saved notebooks
  useEffect(() => {
    fetch("/api/notebook/list")
      .then((res) => res.json())
      .then(setNotebooks);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-gray-200 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          {selectedNotebook ? selectedNotebook.title : "Your Notebooks"}
        </h1>

        {selectedNotebook && (
          <button
            onClick={() => setSelectedNotebook(null)}
            className="text-gray-400 hover:text-white"
          >
            ← Back to library
          </button>
        )}
      </div>

      {/* ================= NETFLIX-STYLE LIBRARY ================= */}
      {!selectedNotebook && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {notebooks.map((nb) => (
            <div
              key={nb._id}
              onClick={() => {
                setSelectedNotebook(nb);
                setActiveView("summary");
              }}
              className="
                bg-[#141416]
                rounded-2xl
                p-6
                cursor-pointer
                border border-transparent
                hover:border-orange-500
                hover:scale-105
                transition
              "
            >
              <h2 className="text-lg font-semibold">{nb.title}</h2>
              <p className="text-gray-400 text-sm mt-2">
                {new Date(nb.createdAt).toDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= NOTEBOOK VIEWER ================= */}
      {selectedNotebook && (
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_380px] gap-6">
          {/* ---------- LEFT (VIEW SELECTOR) ---------- */}
          <div className="space-y-2">
            {["summary", "notes", "explanation", "flashcards"].map((v) => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`
                  w-full px-4 py-3 rounded-xl text-left
                  ${
                    activeView === v
                      ? "bg-orange-500 text-black"
                      : "bg-[#141416] text-gray-300"
                  }
                `}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>

          {/* ---------- CENTER (CONTENT) ---------- */}
          <div className="bg-[#141416] rounded-2xl p-6 overflow-y-auto">
            {activeView === "summary" && (
              <p className="text-gray-300 leading-relaxed">
                {selectedNotebook.summary}
              </p>
            )}

            {activeView === "notes" && (
              <pre className="whitespace-pre-wrap text-gray-300">
                {selectedNotebook.notes}
              </pre>
            )}

            {activeView === "explanation" && (
              <p className="text-gray-300 leading-relaxed">
                {selectedNotebook.easyExplanation}
              </p>
            )}

            {activeView === "flashcards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedNotebook.flashcards.map((c, i) => (
                  <div
                    key={i}
                    className="bg-black p-4 rounded-xl border border-orange-500/20"
                  >
                    <p className="font-semibold">{c.question}</p>
                    <p className="text-gray-400 mt-2">{c.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- RIGHT (CHAT) ---------- */}
          <ChatPanel notes={selectedNotebook.notes} />
        </div>
      )}
    </div>
  );
}

/* =====================================================
   CHAT PANEL (ChatGPT-style)
   ===================================================== */

function ChatPanel({ notes }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;

    const userMsg = { role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    setLoading(true);

    const res = await fetch("/api/notebook/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, notes }),
    });

    const data = await res.json();

    setMessages((m) => [...m, { role: "assistant", text: data.answer }]);

    setLoading(false);
  };

  return (
    <div className="bg-[#141416] rounded-2xl p-4 flex flex-col h-[75vh]">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`
              p-3 rounded-xl max-w-[85%]
              ${
                m.role === "user"
                  ? "bg-orange-500 text-black self-end"
                  : "bg-black text-gray-300"
              }
            `}
          >
            {m.text}
          </div>
        ))}

        {loading && <p className="text-gray-500 text-sm">Thinking…</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything from this notebook…"
          className="flex-1 bg-black px-4 py-3 rounded-xl outline-none"
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button
          onClick={ask}
          className="bg-orange-500 text-black px-4 rounded-xl font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
