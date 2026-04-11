import React from 'react';

const ChapterCard = ({ chapter }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{chapter.title}</h3>
      <p>{chapter.description}</p>
    </div>
  );
};

export default ChapterCard;