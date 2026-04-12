import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChapterCard from "../components/ChapterCard";
import Loader from "../components/Loader";
import api from "../services/api";

export default function Chapters() {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true);
        const [chaptersResponse, subjectResponse] = await Promise.all([
          api.get(`/chapters/${subjectId}`),
          api.get(`/subjects/${subjectId}`),
        ]);
        setChapters(chaptersResponse.data);
        setSubject(subjectResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load chapters right now.");
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, [subjectId]);

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <span className="eyebrow">Subject overview</span>
        <h1>{subject?.name || "Learning chapters"}</h1>
        <p>{subject?.description || "Open each chapter to study notes, watch the lesson video, and take the quiz."}</p>
      </section>

      {loading ? <Loader label="Loading chapters..." /> : null}
      {error ? <div className="message-card error">{error}</div> : null}

      {!loading && !error ? (
        <div className="responsive-grid">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
