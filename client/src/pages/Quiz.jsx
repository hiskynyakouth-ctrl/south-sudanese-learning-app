import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import QuizCard from "../components/QuizCard";
import api from "../services/api";

export default function Quiz() {
  const { chapterId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/quizzes/${chapterId}`);
        setQuiz(data);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [chapterId]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        answers: Object.entries(answers).map(([id, answer]) => ({ id, answer })),
      };
      const { data } = await api.post(`/quizzes/${chapterId}/submit`, payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader label="Loading quiz..." />;
  }

  return (
    <div className="stack-lg">
      <section className="detail-hero compact">
        <div>
          <span className="eyebrow">Quiz system</span>
          <h1>Chapter assessment</h1>
          <p>{answeredCount} of {quiz.length} questions answered.</p>
        </div>
        <button type="button" className="primary-button" onClick={handleSubmit} disabled={submitting || !quiz.length}>
          {submitting ? "Submitting..." : "Submit answers"}
        </button>
      </section>

      {error ? <div className="message-card error">{error}</div> : null}

      <div className="stack-md">
        {quiz.map((item) => (
          <QuizCard
            key={item.id}
            question={item.question}
            options={item.options}
            selected={answers[item.id]}
            disabled={submitting}
            onAnswer={(option) => setAnswers((current) => ({ ...current, [item.id]: option }))}
          />
        ))}
      </div>

      {result ? (
        <section className="content-panel result-panel">
          <div className="panel-heading">
            <span className="eyebrow">Quiz result</span>
            <h2>Score: {result.score} / {result.total}</h2>
          </div>
          <div className="stack-sm">
            {result.review.map((item) => (
              <div key={item.id} className={`review-item ${item.correct ? "correct" : "wrong"}`}>
                <strong>{item.question}</strong>
                <p>Your answer: {item.selected || "No answer"}</p>
                <p>Correct answer: {item.correctAnswer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
