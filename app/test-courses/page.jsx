"use client";

import { useEffect, useState } from "react";

export default function TestCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchCourses() {
    try {
      console.log("Fetching from /api/course..."); // Debug log
      const res = await fetch("/api/course");

      console.log("Response status:", res.status); // Debug log
      console.log("Response ok:", res.ok); // Debug log

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error data:", errorData); // Debug log
        throw new Error(errorData.error || "Failed to fetch courses");
      }

      const data = await res.json();
      console.log("Courses data:", data); // Debug log
      setCourses(data);
    } catch (err) {
      console.error("Fetch error:", err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchCourses();
}, []);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-semibold mb-6">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-neutral-400">No courses found</p>
      ) : (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li
              key={course._id}
              className="border border-white/10 rounded-lg p-4"
            >
              <p className="font-medium">{course.title}</p>
              <p className="text-sm text-neutral-400">
                Difficulty: {course.difficulty}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
