
interface Award {
  title: string;
  year: string;
}

interface Fellowship {
  title: string;
  period: string;
}

interface Grant {
  title: string;
  amount: string;
  period: string;
}

interface Supervision {
  type: string;
  count: number;
}

interface AwardsTabProps {
  awards: Award[];
  fellowships: Fellowship[];
  grants: Grant[];
  memberships: string[];
  supervision: Supervision[];
}

const AwardsTab = ({ awards, fellowships, grants, memberships, supervision }: AwardsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Awards */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Awards</h2>
        <div className="space-y-3">
          {awards.map((award, index) => (
            <div key={index} className="flex justify-between items-center">
              <h3 className="font-medium">{award.title}</h3>
              <span className="text-sm text-gray-600">{award.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fellowships */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Fellowships</h2>
        <div className="space-y-3">
          {fellowships.map((fellowship, index) => (
            <div key={index} className="flex justify-between items-center">
              <h3 className="font-medium">{fellowship.title}</h3>
              <span className="text-sm text-gray-600">{fellowship.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Research Grants */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Research Grants</h2>
        <div className="space-y-3">
          {grants.map((grant, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{grant.title}</h3>
                <span className="text-sm text-gray-600">{grant.period}</span>
              </div>
              <p className="text-sm text-blue-600 font-medium">{grant.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Memberships */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Professional Memberships</h2>
        <div className="space-y-2">
          {memberships.map((membership, index) => (
            <div key={index} className="flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              <span>{membership}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Supervision */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Supervision</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supervision.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{item.count}</div>
              <div className="text-sm text-gray-600">{item.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwardsTab;
