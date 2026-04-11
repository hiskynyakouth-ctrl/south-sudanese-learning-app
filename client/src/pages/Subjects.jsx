import React, { useState, useEffect } from 'react';
import SubjectCard from '../components/SubjectCard';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // Fetch subjects from API
    // For now, mock data
    setSubjects([
      { id: 1, name: 'Mathematics', description: 'Basic math concepts' },
      { id: 2, name: 'Science', description: 'Physics, Chemistry, Biology' },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default Subjects;