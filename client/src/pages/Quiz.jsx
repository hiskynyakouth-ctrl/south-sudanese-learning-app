import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizCard from '../components/QuizCard';

const Quiz = () => {
  const { chapterId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      answer: '4'
    }
  ];

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion].answer) {
      alert('Correct!');
    } else {
      alert('Wrong!');
    }
    // Next question
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>
      <QuizCard
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default Quiz;