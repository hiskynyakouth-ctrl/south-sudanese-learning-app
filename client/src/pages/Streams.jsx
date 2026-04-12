import { useParams, Link } from "react-router-dom";

export default function Streams() {
  const { id } = useParams();

  const data = {
    1: {
      name: "Senior 1",
      streams: [
        { name: "Natural Science", subjects: ["Math", "English", "Biology", "Chemistry", "Physics", "Agriculture", "CRE", "Computer Studies"] },
        { name: "Social Science", subjects: ["Math", "English", "History", "Geography", "Economics", "CRE", "Business Studies", "Literature"] }
      ]
    },

    2: {
      name: "Senior 2",
      streams: [
        { name: "Natural Science", subjects: ["Math", "English", "Biology", "Chemistry", "Physics", "Agriculture", "CRE", "Computer"] },
        { name: "Social Science", subjects: ["Math", "English", "History", "Geography", "Economics", "Literature", "Accounting", "Business"] }
      ]
    },

    3: {
      name: "Senior 3",
      streams: [
        { name: "Natural Science", subjects: ["Math", "English", "Biology", "Chemistry", "Physics", "CRE", "Agriculture", "ICT"] },
        { name: "Social Science", subjects: ["Math", "English", "History", "Geography", "Economics", "Literature", "Accounting", "Business", "CRE"] }
      ]
    },

    4: {
      name: "Senior 4",
      streams: [
        { name: "Natural Science", subjects: ["Math", "English", "Biology", "Chemistry", "Physics", "CRE", "ICT", "Agriculture"] },
        { name: "Social Science", subjects: ["Math", "English", "History", "Geography", "Economics", "Literature", "Accounting", "Business", "CRE"] }
      ]
    }
  };

  const level = data[id];

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">{level.name}</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {level.streams.map((stream, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-xl font-bold mb-4">
              {stream.name}
            </h2>

            <div className="grid grid-cols-2 gap-2">

              {stream.subjects.map((sub, j) => (
                <Link key={j} to="/chapters/1">
                  <div className="bg-blue-100 p-2 rounded text-center text-sm hover:bg-blue-200">
                    {sub}
                  </div>
                </Link>
              ))}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}