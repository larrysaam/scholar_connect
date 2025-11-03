
interface Experience {
  position: string;
  institution: string;
  period: string;
}

interface ExperienceTabProps {
  experience: Experience[];
}

const ExperienceTab = ({ experience }: ExperienceTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Experience</h2>
      <div className="space-y-4">
        {experience.map((exp, index) => (
          <div key={index} className="border-l-2 border-blue-600 pl-4 py-1">
            <h3 className="font-medium">{exp.position}</h3>
            <p className="text-gray-600">{exp.institution}</p>
            <p className="text-sm text-gray-500">{exp.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTab;
