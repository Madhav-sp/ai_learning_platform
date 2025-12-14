"use client";

import { useEffect, useRef } from "react";

export default function CourseRoadmap({ course, onSelectChapter }) {
  return (
    <div className="relative max-w-5xl mx-auto px-4 py-16">
      {/* Vertical line (desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 h-full w-[3px] bg-gradient-to-b from-purple-400 to-purple-600 -translate-x-1/2" />

      <div className="space-y-20">
        {course.chapters.map((chapter, index) => (
          <RoadmapItem
            key={index}
            index={index}
            chapter={chapter}
            onSelect={() => onSelectChapter(index)}
          />
        ))}
      </div>
    </div>
  );
}

/* ================= ROADMAP ITEM ================= */

function RoadmapItem({ chapter, index, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-in");
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-10 transition-all duration-700
        md:flex md:items-center
        ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Step circle */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
        <div className="h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold shadow-lg">
          {index + 1}
        </div>
      </div>

      {/* Card */}
      <div
        onClick={onSelect}
        className="cursor-pointer w-full md:w-[420px] rounded-2xl p-6 shadow-xl
                   transition-transform duration-300 hover:scale-[1.03]
                   bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
      >
        <div className="text-sm opacity-80">Chapter {index + 1}</div>

        <h3 className="text-xl font-semibold mt-1">{chapter.chapterTitle}</h3>

        <div className="mt-4 flex flex-wrap gap-3 text-sm opacity-90">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            ⏱ {chapter.duration}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            📚 {chapter.topics.length} Topics
          </span>
        </div>

        <div className="mt-5 text-sm font-medium underline">
          Start Chapter →
        </div>
      </div>
    </div>
  );
}
