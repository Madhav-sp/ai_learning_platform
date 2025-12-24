"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Zap,
  Layers,
  MessageSquare,
  ArrowLeft,
  Plus,
  Search,
  Home,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { useClerk, UserButton } from "@clerk/nextjs";
import WeatherWidget from "../components/WeatherWidget";

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [activeView, setActiveView] = useState("summary");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/notebook/list")
      .then((res) => res.json())
      .then(setNotebooks);
  }, []);

  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans">
      {/* GLOBAL SIDEBAR */}
      <Sidebar activePage="/notebook" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* GLOBAL TOPBAR */}
        <TopBar
          currentPage={selectedNotebook ? selectedNotebook.title : "Library"}
        />

        <main className="flex-1 overflow-hidden relative">
          {!selectedNotebook ? (
            /* ================= LIBRARY VIEW (GRID) ================= */
            <div className="h-full overflow-y-auto p-8 custom-scroll">
              <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                      Notebook<span className="text-orange-500">LLM</span>
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Your personal AI research assistant.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/notebook/upload")}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/10"
                  >
                    <Plus size={20} /> New Notebook
                  </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notebooks.map((nb) => (
                    <div
                      key={nb._id}
                      onClick={() => {
                        setSelectedNotebook(nb);
                        setActiveView("summary");
                      }}
                      className="group bg-[#111113] border border-white/5 p-6 rounded-3xl hover:border-orange-500/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="h-12 w-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                        <BookOpen className="text-orange-500" size={24} />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-100 group-hover:text-orange-400 transition-colors uppercase tracking-tight">
                        {nb.title}
                      </h2>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {nb.summary || "This content provides an overview..."}
                      </p>
                      <div className="mt-6 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                        Created {new Date(nb.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ================= WORKSPACE VIEW (EDITOR) ================= */
            <div className="flex h-full overflow-hidden animate-in fade-in duration-500">
              {/* Internal Sub-Sidebar */}
              <aside className="w-64 border-r border-white/5 bg-[#0e0e10] p-4 flex flex-col gap-2">
                <button
                  onClick={() => setSelectedNotebook(null)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 hover:text-orange-400 transition-colors mb-4"
                >
                  <ArrowLeft size={14} /> Back to Library
                </button>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-2">
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

              {/* Main Content Pane */}
              <section className="flex-1 overflow-y-auto bg-[#0b0b0c] p-12 custom-scroll">
                <div className="max-w-3xl mx-auto">
                  {activeView === "summary" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-tight">
                        Summary
                      </h2>
                      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
                        {selectedNotebook.summary}
                      </div>
                    </div>
                  )}

                  {activeView === "notes" && (
                    <div className="animate-in fade-in duration-500">
                      <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-tight">
                        Source Notes
                      </h2>
                      <pre className="whitespace-pre-wrap font-sans text-gray-400 bg-[#111113] p-8 rounded-2xl border border-white/5 leading-relaxed">
                        {selectedNotebook.notes}
                      </pre>
                    </div>
                  )}

                  {activeView === "flashcards" && (
                    <div className="animate-in fade-in duration-500">
                      <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-tight">
                        Flashcards
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedNotebook.flashcards?.map((c, i) => (
                          <div
                            key={i}
                            className="bg-[#111113] p-6 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all"
                          >
                            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                              Question
                            </p>
                            <p className="text-lg font-medium text-white mb-4">
                              {c.question}
                            </p>
                            <div className="h-px bg-white/5 mb-4" />
                            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                              Answer
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                              {c.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeView === "explanation" && (
                    <div className="animate-in fade-in duration-500 text-center py-20">
                      <Zap className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                      <h2 className="text-xl font-semibold text-white">
                        AI Detailed Explanation
                      </h2>
                      <p className="text-gray-500 mt-2">
                        Generate deep-dive insights for {selectedNotebook.title}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Chat Sidebar */}
              <aside className="w-[400px] border-l border-white/5 bg-[#0e0e10]">
                <ChatPanel notes={selectedNotebook.notes} />
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ================= SHARED COMPONENTS ================= */

function Sidebar({ activePage }) {
  const { signOut } = useClerk();
  const router = useRouter();
  const navItems = [
    { icon: Home, label: "Home", address: "/" },
    { icon: BookOpen, label: "Library", address: "/notebook" },
    { icon: BarChart3, label: "Analytics", address: "/analytics" },
    { icon: Target, label: "Goals", address: "/goals" },
    { icon: Settings, label: "Settings", address: "/settings" },
  ];

  return (
    <aside className="w-20 bg-[#0e0e10] border-r border-white/5 flex flex-col items-center py-8 justify-between">
      <div className="flex flex-col items-center gap-10">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.address)}
              className={`p-3 rounded-xl transition-colors ${
                activePage === item.address
                  ? "bg-white/10 text-orange-400"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
      </div>
      <button
        onClick={() => signOut({ redirectUrl: "/" })}
        className="p-3 text-gray-600 hover:text-red-400 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
}

function TopBar({ currentPage }) {
  return (
    <header className="h-20 bg-[#0b0b0c] border-b border-white/5 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <h1 className="text-sm font-medium tracking-wide text-gray-200 uppercase">
          Console <span className="text-gray-500">/ {currentPage}</span>
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search notebooks..."
            className="bg-[#111113] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-orange-500/30 text-gray-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-5">
        <button className="relative text-gray-400 hover:text-gray-200">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-1">
          <WeatherWidget />
          <UserButton />
        </div>
      </div>
    </header>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active
          ? "bg-orange-500 text-black font-semibold shadow-lg shadow-orange-500/20"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
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
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    const currentQ = question;
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/notebook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQ, notes }),
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
        <span className="font-semibold text-sm">AI Notebook Guide</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scroll">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Search className="text-gray-700 mx-auto mb-2" size={32} />
            <p className="text-gray-500 text-xs px-8">
              Ask anything about your documents.
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
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-orange-500 text-black font-medium"
                  : "bg-white/5 text-gray-300 border border-white/5"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-orange-500 text-xs animate-pulse">
            AI is thinking...
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
            className="w-full bg-[#141416] border border-white/10 text-white pl-4 pr-12 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-600"
          />
          <button
            onClick={ask}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 hover:bg-orange-600 text-black rounded-xl"
          >
            <Plus size={18} className="rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
}
