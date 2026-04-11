import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChapterCard from '../components/ChapterCard';

const Chapters = () => {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    // Fetch chapters for subject
    setChapters([
      { id: 1, title: 'Chapter 1', description: 'Introduction' },
    ]);
  }, [subjectId]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chapters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default Chapters;