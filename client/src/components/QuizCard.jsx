import React from 'react';

const QuizCard = ({ question, options, onAnswer }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="block w-full text-left p-2 border rounded hover:bg-gray-100"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;