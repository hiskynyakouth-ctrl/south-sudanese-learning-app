import React from 'react';

const SubjectCard = ({ subject }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{subject.name}</h3>
      <p>{subject.description}</p>
    </div>
  );
};

export default SubjectCard;