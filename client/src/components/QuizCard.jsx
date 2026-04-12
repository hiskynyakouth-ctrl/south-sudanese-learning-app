export default function QuizCard({ question, options = [], selected, onAnswer, disabled }) {
  return (
    <section className="quiz-card">
      <p className="eyebrow">Quiz question</p>
      <h3>{question}</h3>
      <div className="quiz-options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`quiz-option ${selected === option ? "selected" : ""}`}
            onClick={() => onAnswer(option)}
            disabled={disabled}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
