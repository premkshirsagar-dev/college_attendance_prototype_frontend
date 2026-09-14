// constants/classes.js
// Single source of truth for every class/course offered by the college.
// Every page that needs a class dropdown imports from here instead of
// hardcoding its own list — add a new course ONCE, here, and it shows
// up everywhere automatically (registration, student management,
// attendance marking, rankings, etc.)

const COURSES = [
  "B.Sc. (Biotechnology)",
  "B.Sc. (Bio-Computer)",
  "B.Sc. (Mathematics–Computer)",
  "B.Sc. (Mathematics – Plain)",
  "B.Com.",
  "BBA (Hons.)",
  "BCA",
  "B.Sc. (Microbiology)",
  "B.Com. (Computer)",
  "B.A. (Computer)",
  "M.Sc. (Biotechnology)",
  "M.Sc. (Microbiology)",
  "M.Sc. (Chemistry)",
  "M.Sc. (Botany)",
  "M.Sc. (Mathematics)",
  "M.Com.",
  "M.A. (Sociology)",
  "MCM (Master of Computer Management)",
  "PGDCA (Post Graduate Diploma in Computer Applications)",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year"];

export const CLASS_OPTIONS = COURSES.flatMap((course) =>
  YEARS.map((year) => `${course} ${year}`)
);

export default CLASS_OPTIONS;
