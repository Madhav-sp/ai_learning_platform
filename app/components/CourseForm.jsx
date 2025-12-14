"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CourseForm() {
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    includeVideos: false,
    chaptersCount: 5,
    category: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Please sign in first");

    setLoading(true);

    try {
      const res = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.success) {
        router.push(`/course/${data.courseId}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow"
    >
      {/* COURSE TITLE */}
      <input
        type="text"
        placeholder="Course Title (e.g. Java Arrays Mastery)"
        required
        className="w-full p-2 border rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="What will students learn from this course?"
        required
        className="w-full p-2 border rounded min-h-[100px]"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {/* DIFFICULTY */}
      <select
        className="w-full p-2 border rounded"
        value={form.difficulty}
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      {/* CATEGORY (comma separated → array) */}
      <input
        type="text"
        placeholder="Category (e.g. Java, DSA, Backend)"
        className="w-full p-2 border rounded"
        onChange={(e) =>
          setForm({
            ...form,
            category: e.target.value
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean),
          })
        }
      />

      {/* CHAPTER COUNT */}
      <input
        type="number"
        min="1"
        max="20"
        required
        className="w-full p-2 border rounded"
        placeholder="Number of Chapters (1–20)"
        value={form.chaptersCount}
        onChange={(e) =>
          setForm({
            ...form,
            chaptersCount: Number(e.target.value),
          })
        }
      />

      {/* INCLUDE VIDEOS */}
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={form.includeVideos}
          onChange={(e) =>
            setForm({
              ...form,
              includeVideos: e.target.checked,
            })
          }
        />
        Include video references
      </label>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="w-full bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Generating Course..." : "Generate Course"}
      </button>
    </form>
  );
}
