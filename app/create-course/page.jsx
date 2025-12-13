"use client";

import CourseForm from "../components/CourseForm";

export default function CreateCoursePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create AI Course</h1>

      <CourseForm />
    </div>
  );
}
