"use client";
import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  Zap,
  Layers,
  MessageSquare,
  ArrowLeft,
  Plus,
  Search,
} from "lucide-react"; // I recommend adding lucide-react for icons

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [activeView, setActiveView] = useState("summary");

  useEffect(() => {
    fetch("/api/notebook/list")
      .then((res) => res.json())
      .then(setNotebooks);
  }, []);

  // --- LIBRARY VIEW ---
  if (!selectedNotebook) {
    return (
      <div className="min-h-screen bg-[#000000] text-gray-100 p-8">
        <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Notebook<span className="text-orange-500">LLM</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Your personal AI research assistant.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black px-5 py-2.5 rounded-full font-semibold transition-all">
            <Plus size={20} /> New Notebook
          </button>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {notebooks.map((nb) => (
            <div
              key={nb._id}
              onClick={() => {
                setSelectedNotebook(nb);
                setActiveView("summary");
              }}
              className="group bg-[#0b0b0c] border border-white/5 p-6 rounded-2xl hover:border-orange-500/50 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-10 w-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-orange-500" size={20} />
              </div>
              <h2 className="text-lg font-semibold group-hover:text-orange-500 transition-colors">
                {nb.title}
              </h2>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {nb.summary?.substring(0, 60)}...
              </p>
              <div className="mt-6 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                Created {new Date(nb.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- WORKSPACE VIEW ---
  return (
    <div className="h-screen flex flex-col bg-[#000000] text-gray-200 overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0b0b0c]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedNotebook(null)}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <h1 className="font-medium text-gray-100">
            {selectedNotebook.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/10 text-orange-500 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/20">
            AI SYNCED
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Nav */}
        <aside className="w-64 border-r border-white/5 bg-[#0b0b0c] p-4 flex flex-col gap-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
            Notebook Guide
          </p>
          <SidebarItem
            icon={<FileText size={18} />}
            label="Summary"
            active={activeView === "summary"}
            onClick={() => setActiveView("summary")}
          />
          <SidebarItem
            icon={<Layers size={18} />}
            label="Full Notes"
            active={activeView === "notes"}
            onClick={() => setActiveView("notes")}
          />
          <SidebarItem
            icon={<Zap size={18} />}
            label="Explanation"
            active={activeView === "explanation"}
            onClick={() => setActiveView("explanation")}
          />
          <SidebarItem
            icon={<BookOpen size={18} />}
            label="Flashcards"
            active={activeView === "flashcards"}
            onClick={() => setActiveView("flashcards")}
          />
        </aside>

        {/* Center: Content Area */}
        <section className="flex-1 overflow-y-auto bg-[#000000] p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {activeView === "summary" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-bold mb-8 text-white">Summary</h2>
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
                  {selectedNotebook.summary}
                </div>
              </div>
            )}

            {activeView === "notes" && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-bold mb-8 text-white">
                  Source Notes
                </h2>
                <pre className="whitespace-pre-wrap font-sans text-gray-400 bg-[#0b0b0c] p-8 rounded-2xl border border-white/5 leading-relaxed">
                  {selectedNotebook.notes}
                </pre>
              </div>
            )}

            {activeView === "flashcards" && (
              <div className="grid grid-cols-1 gap-4">
                {selectedNotebook.flashcards.map((c, i) => (
                  <div
                    key={i}
                    className="bg-[#0b0b0c] p-6 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors"
                  >
                    <p className="text-orange-500 text-xs font-bold uppercase mb-2">
                      Question
                    </p>
                    <p className="text-lg font-medium text-white mb-4">
                      {c.question}
                    </p>
                    <div className="h-px bg-white/5 mb-4" />
                    <p className="text-gray-400">{c.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ... other views ... */}
          </div>
        </section>

        {/* Right: Modern Chat Panel */}
        <aside className="w-[400px] border-l border-white/5 bg-[#0b0b0c] flex flex-col">
          <ChatPanel notes={selectedNotebook.notes} />
        </aside>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${
          active
            ? "bg-orange-500 text-black font-semibold shadow-lg shadow-orange-500/20"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function ChatPanel({ notes }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    // Mocking the delay and response for UI feel
    try {
      const res = await fetch("/api/notebook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, notes }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <MessageSquare size={18} className="text-orange-500" />
        <span className="font-semibold text-sm">Notebook Guide</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-orange-500" size={20} />
            </div>
            <p className="text-gray-500 text-sm px-8">
              Ask a question about your documents to get started.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
              max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
              ${
                m.role === "user"
                  ? "bg-orange-500 text-black font-medium"
                  : "bg-white/5 text-gray-300 border border-white/5"
              }
            `}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="Ask your notebook..."
            className="w-full bg-[#141416] border border-white/10 text-white pl-4 pr-12 py-4 rounded-2xl focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-600 shadow-2xl"
          />
          <button
            onClick={ask}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-orange-500 hover:bg-orange-600 text-black rounded-xl transition-colors"
          >
            <Plus size={20} className="rotate-45" />{" "}
            {/* Using Plus rotated as a Send icon variant */}
          </button>
        </div>
      </div>
    </div>
  );
}
