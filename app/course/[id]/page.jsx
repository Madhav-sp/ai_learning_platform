import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export default async function CoursePage({ params }) {
  const { id } = await params; // Next.js 15 fix

  await connectDB();

  const course = await Course.findById(id).lean();

  if (!course) {
    return <h1>Course not found</h1>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "auto" }}>
      {/* COURSE HEADER */}
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <hr />

      {/* CHAPTERS */}
      {course.chapters.map((chapter, chapterIndex) => (
        <div key={chapter._id} style={{ marginTop: "32px" }}>
          <h2>
            Chapter {chapterIndex + 1}: {chapter.chapterTitle}
          </h2>
          <p>⏱ Duration: {chapter.duration}</p>

          {/* TOPICS */}
          {chapter.topics.map((topic, topicIndex) => (
            <div
              key={topic._id}
              style={{
                marginTop: "20px",
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3>
                {chapterIndex + 1}.{topicIndex + 1} {topic.title}
              </h3>

              <p>{topic.content}</p>

              {/* FLASHCARDS */}
              {topic.flashcards?.length > 0 && (
                <>
                  <h4>📘 Flashcards</h4>
                  <ul>
                    {topic.flashcards.map((card) => (
                      <li key={card._id}>
                        <strong>Q:</strong> {card.question} <br />
                        <strong>A:</strong> {card.answer}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* QUIZ */}
              {topic.quiz?.length > 0 && (
                <>
                  <h4>📝 Quiz</h4>
                  {topic.quiz.map((q) => (
                    <div key={q._id} style={{ marginBottom: "12px" }}>
                      <p>
                        <strong>{q.question}</strong>
                      </p>
                      <ul>
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                      <p>✅ Answer: {q.answer}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
