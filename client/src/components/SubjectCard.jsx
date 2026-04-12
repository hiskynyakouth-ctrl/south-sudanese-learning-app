import { Link } from "react-router-dom";
import { truncate } from "../utils/helpers";

export default function SubjectCard({ subject, classLabel }) {
  return (
    <Link to={`/chapters/${subject.id}`} className="card subject-card">
      <div className="card-icon">{subject.name.slice(0, 2).toUpperCase()}</div>
      <div className="card-copy">
        <span className="eyebrow">{classLabel}</span>
        <h3>{subject.name}</h3>
        <p>{truncate(subject.description || "Structured notes, videos, and quizzes for this subject.", 110)}</p>
      </div>
      <span className="card-link-text">Open chapters</span>
    </Link>
  );
}
