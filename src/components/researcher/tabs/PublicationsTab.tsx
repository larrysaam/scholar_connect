
interface Publication {
  title: string;
  journal: string;
  year: string;
}

interface PublicationsTabProps {
  publications: Publication[];
}

const PublicationsTab = ({ publications }: PublicationsTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Selected Publications</h2>
      <div className="space-y-6">
        {publications.map((pub, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
            <h3 className="font-medium text-blue-700 hover:underline cursor-pointer">{pub.title}</h3>
            <p className="text-gray-600 text-sm">{pub.journal}, {pub.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationsTab;
