import {
  FaFlask, FaCalculator, FaBolt, FaAtom, FaLeaf, FaLandmark,
  FaGlobe, FaBook, FaBookOpen, FaChartBar, FaLaptop, FaPalette,
  FaChurch, FaCoins, FaBalanceScale, FaSquareRootAlt, FaMicroscope,
  FaPen, FaGraduationCap,
} from "react-icons/fa";
import { GiChemicalDrop, GiDna1, GiEarthAmerica, GiWheat } from "react-icons/gi";
import { MdComputer, MdAccountBalance, MdMenuBook } from "react-icons/md";
import { BsCalculatorFill } from "react-icons/bs";

// Map subject name → real icon component + color
const SUBJECT_ICONS = {
  "Biology":                    { Icon: GiDna1,           color: "#2e7d32", bg: "#e8f5e9" },
  "Chemistry":                  { Icon: GiChemicalDrop,   color: "#e65100", bg: "#fff3e0" },
  "Physics":                    { Icon: FaBolt,           color: "#6a1b9a", bg: "#f3e5f5" },
  "Mathematics":                { Icon: BsCalculatorFill, color: "#c62828", bg: "#fce4ec" },
  "Additional Mathematics":     { Icon: FaSquareRootAlt,  color: "#880e4f", bg: "#fce4ec" },
  "English":                    { Icon: FaBookOpen,       color: "#1565c0", bg: "#e3f2fd" },
  "English Literature":         { Icon: FaPen,            color: "#558b2f", bg: "#f9fbe7" },
  "History":                    { Icon: FaLandmark,       color: "#bf360c", bg: "#fbe9e7" },
  "Geography":                  { Icon: GiEarthAmerica,   color: "#006064", bg: "#e0f7fa" },
  "Economics":                  { Icon: FaCoins,          color: "#1b5e20", bg: "#e8f5e9" },
  "Accounting":                 { Icon: MdAccountBalance, color: "#004d40", bg: "#e0f2f1" },
  "Agriculture":                { Icon: GiWheat,          color: "#33691e", bg: "#f1f8e9" },
  "Computer Studies":           { Icon: MdComputer,       color: "#283593", bg: "#e8eaf6" },
  "Fine Art":                   { Icon: FaPalette,        color: "#880e4f", bg: "#fce4ec" },
  "Christian Religious Education": { Icon: FaChurch,      color: "#4a148c", bg: "#f3e5f5" },
  "CRE":                        { Icon: FaChurch,         color: "#4a148c", bg: "#f3e5f5" },
  "Citizenship":                { Icon: FaBalanceScale,   color: "#f57f17", bg: "#fff8e1" },
  "Commerce":                   { Icon: FaChartBar,       color: "#e65100", bg: "#fff3e0" },
  "ICT":                        { Icon: FaLaptop,         color: "#283593", bg: "#e8eaf6" },
};

const DEFAULT = { Icon: FaBook, color: "#0f6b5b", bg: "#e8f5e9" };

export default function SubjectIcon({ subject, size = 36, showFlag = false }) {
  // Citizenship gets the real SS flag
  if (subject === "Citizenship" || showFlag) {
    return (
      <img
        src="https://flagcdn.com/w40/ss.png"
        alt="South Sudan"
        style={{ width: size * 1.2, height: size * 0.8, objectFit: "cover", borderRadius: 4 }}
        onError={e => { e.target.onerror = null; e.target.style.display = "none"; }}
      />
    );
  }

  const { Icon, color } = SUBJECT_ICONS[subject] || DEFAULT;
  return <Icon size={size} color={color} />;
}

export function getSubjectStyle(subject) {
  return SUBJECT_ICONS[subject] || DEFAULT;
}
