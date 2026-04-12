import { Link } from "react-router-dom";
import { truncate } from "../utils/helpers";

export default function ChapterCard({ chapter }) {
  return (
    <Link to={`/chapter/${chapter.id}`} className="card chapter-card">
      <div className="chapter-meta">
        <span className="eyebrow">Chapter {chapter.id}</span>
        <span className="quiz-chip">{chapter.quiz_count || 0} quiz items</span>
      </div>
      <h3>{chapter.title}</h3>
      <p>{truncate(chapter.content || "This chapter includes notes, revision questions, and guided learning support.", 130)}</p>
    </Link>
  );
}
