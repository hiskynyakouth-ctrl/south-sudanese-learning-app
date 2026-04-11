import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';

const ChapterDetails = () => {
  const { chapterId } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chapter Details</h1>
      <VideoPlayer src="path/to/video.mp4" />
      <p className="mt-4">Chapter content here...</p>
    </div>
  );
};

export default ChapterDetails;