import books from "../data/books";
import { useState } from "react";

export default function Subjects() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjectList = books.map((b) => b.subject);

  const selected = books.find((b) => b.subject === selectedSubject);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Subjects
      </h1>

      {/* SUBJECT LIST */}
      <div className="grid grid-cols-2 gap-3">
        {subjectList.map((sub, i) => (
          <button
            key={i}
            onClick={() => setSelectedSubject(sub)}
            className="bg-blue-500 text-white p-3 rounded-xl"
          >
            {sub}
          </button>
        ))}
      </div>

      {/* BOOKS */}
      {selected && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">
            {selected.subject} Books
          </h2>

          <div className="grid gap-4">
            {selected.books.map((book, i) => (
              <div
                key={i}
                className="bg-white shadow p-4 rounded-xl"
              >
                <h3 className="font-bold text-lg">
                  {book.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {book.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}