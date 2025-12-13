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
    setLoading(true);

    const res = await fetch("/api/generate-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        ...form,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      router.push(`/course/${data.courseId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Course Title"
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Course Description"
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <select
        className="w-full p-2 border rounded"
        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <input
        type="number"
        min="1"
        max="20"
        className="w-full p-2 border rounded"
        placeholder="Number of Chapters"
        onChange={(e) =>
          setForm({ ...form, chaptersCount: Number(e.target.value) })
        }
      />

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          onChange={(e) =>
            setForm({ ...form, includeVideos: e.target.checked })
          }
        />
        Include videos
      </label>

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Course"}
      </button>
    </form>
  );
}
