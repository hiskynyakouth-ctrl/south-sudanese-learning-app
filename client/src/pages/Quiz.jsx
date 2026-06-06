import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import QuizCard from "../components/QuizCard";
import api from "../services/api";

export default function Quiz() {
  const { chapterId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [chapterTitle, setChapterTitle] = useState("");
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
        // Server returns { chapterTitle, questions } — extract the array
        const questions = Array.isArray(data) ? data : (data?.questions ?? []);
        setQuiz(questions);
        if (data?.chapterTitle) setChapterTitle(data.chapterTitle);
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
    setSubmitting(true);
    // Grade locally — the server has no submit endpoint
    const review = quiz.map((item) => ({
      id: item._id || item.id,
      question: item.question,
      selected: answers[item._id || item.id] || null,
      correctAnswer: item.correct_answer ?? item.correctAnswer ?? item.answer,
      correct: (answers[item._id || item.id]) === (item.correct_answer ?? item.correctAnswer ?? item.answer),
    }));
    const score = review.filter(r => r.correct).length;
    setResult({ score, total: quiz.length, review });
    setSubmitting(false);
  };

  if (loading) {
    return <Loader label="Loading quiz..." />;
  }

  return (
    <div className="stack-lg">
      <section className="detail-hero compact">
        <div>
          <span className="eyebrow">Quiz</span>
          <h1>{chapterTitle || "Chapter Assessment"}</h1>
          <p>{answeredCount} of {quiz.length} questions answered.</p>
        </div>
        <button type="button" className="primary-button" onClick={handleSubmit} disabled={submitting || !quiz.length || answeredCount < quiz.length}>
          {submitting ? "Grading..." : `Submit Answers (${answeredCount}/${quiz.length})`}
        </button>
      </section>

      {error ? <div className="message-card error">{error}</div> : null}

      <div className="stack-md">
        {quiz.map((item) => {
          const qId = item._id || item.id;
          return (
            <QuizCard
              key={qId}
              question={item.question}
              options={item.options}
              selected={answers[qId]}
              disabled={submitting || result !== null}
              onAnswer={(option) => setAnswers((current) => ({ ...current, [qId]: option }))}
            />
          );
        })}
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
