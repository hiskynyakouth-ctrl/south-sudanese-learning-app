import { getYoutubeEmbedUrl } from "../utils/helpers";

export default function VideoPlayer({ src, title }) {
  const embedUrl = getYoutubeEmbedUrl(src);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="video-panel">
      <iframe
        src={embedUrl}
        title={title || "Lesson video"}
        className="video-frame"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
