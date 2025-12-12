import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  title: String,
  content: String,
  videoUrls: [String],
  flashcards: [
    {
      question: String,
      answer: String,
    },
  ],
  quiz: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
});

const ChapterSchema = new mongoose.Schema({
  chapterTitle: String,
  duration: String,
  topics: [TopicSchema],
  completed: { type: Boolean, default: false },
});

const CourseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: String,
    description: String,
    difficulty: String,
    includeVideos: Boolean,
    category: [String],
    chapters: [ChapterSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
