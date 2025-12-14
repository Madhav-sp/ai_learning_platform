import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseUI from "./CourseUI";

export default async function CoursePage({ params }) {
  const { id } = await params;

  await connectDB();
  const course = await Course.findById(id).lean();

  if (!course) {
    return <h1>Course not found</h1>;
  }

  return <CourseUI course={course} />;
}
