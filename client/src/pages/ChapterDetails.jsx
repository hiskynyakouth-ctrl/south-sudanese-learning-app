import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import VideoPlayer from "../components/VideoPlayer";
import api from "../services/api";

export default function ChapterDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadChapter = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/chapters/chapter/${id}`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load chapter details.");
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [id]);

  if (loading) {
    return <Loader label="Loading chapter details..." />;
  }

  if (error) {
    return <div className="message-card error">{error}</div>;
  }

  const chapter = data?.chapter;

  return (
    <div className="stack-lg">
      <section className="detail-hero">
        <div>
          <span className="eyebrow">Chapter lesson</span>
          <h1>{chapter?.title}</h1>
          <p>
            Study the notes below, watch the lesson video, answer the discussion questions, and then test yourself.
          </p>
        </div>
        <Link to={`/quiz/${id}`} className="primary-link">
          Start quiz
        </Link>
      </section>

      <VideoPlayer src={chapter?.video_url} title={chapter?.title} />

      <section className="detail-grid">
        <article className="content-panel notes-panel">
          <div className="panel-heading">
            <span className="eyebrow">Notes</span>
            <h2>Chapter explanation</h2>
          </div>
          <p>{chapter?.content}</p>
        </article>

        <aside className="content-panel questions-panel">
          <div className="panel-heading">
            <span className="eyebrow">Discussion</span>
            <h2>Questions and answers</h2>
          </div>
          {data?.questions?.length ? (
            <div className="stack-md">
              {data.questions.map((item) => (
                <div key={item.id} className="question-item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No discussion questions have been added for this chapter yet.</p>
          )}
        </aside>
      </section>

      <section className="content-panel">
        <div className="panel-heading">
          <span className="eyebrow">Quiz preview</span>
          <h2>{data?.quizCount || 0} revision questions available</h2>
        </div>
        {data?.quizPreview?.length ? (
          <ul className="preview-list">
            {data.quizPreview.map((item) => (
              <li key={item.id}>{item.question}</li>
            ))}
          </ul>
        ) : (
          <p>Quiz questions will appear here once they are added.</p>
        )}
      </section>
    </div>
  );
}
