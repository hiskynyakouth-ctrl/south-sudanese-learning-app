import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubjectCard from "../components/SubjectCard";
import Loader from "../components/Loader";
import api from "../services/api";

export default function Subjects() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/subjects");
        setSubjects(data);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load subjects right now.");
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [classId]);

  return (
    <div className="stack-lg">
      <section className="section-heading">
        <span className="eyebrow">Senior {classId}</span>
        <h1>Subjects and learning pathways</h1>
        <p>Choose a subject to open chapters, revision notes, lesson videos, and quizzes.</p>
      </section>

      {loading ? <Loader label="Loading subjects..." /> : null}
      {error ? <div className="message-card error">{error}</div> : null}

      {!loading && !error ? (
        <div className="responsive-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} classLabel={`Senior ${classId}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
