
interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface EducationTabProps {
  education: Education[];
}

const EducationTab = ({ education }: EducationTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="border-l-2 border-blue-600 pl-4 py-1">
            <h3 className="font-medium">{edu.degree}</h3>
            <p className="text-gray-600">{edu.institution}, {edu.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationTab;
