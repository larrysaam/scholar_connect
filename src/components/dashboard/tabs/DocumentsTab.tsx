
const DocumentsTab = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      <p className="text-gray-600">Access shared documents and resources from your consultations.</p>
      
      <div className="mt-6">
        <div className="space-y-3">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Research Paper Template</h3>
            <p className="text-sm text-gray-500">PDF • 2.3 MB • Shared by Dr. Marie Ngono</p>
            <button className="text-blue-600 text-sm mt-2">Download</button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Data Analysis Guidelines</h3>
            <p className="text-sm text-gray-500">DOCX • 1.8 MB • Shared by Dr. Paul Mbarga</p>
            <button className="text-blue-600 text-sm mt-2">Download</button>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Bibliography Format Guide</h3>
            <p className="text-sm text-gray-500">PDF • 0.9 MB • Shared by Prof. Sarah Tankou</p>
            <button className="text-blue-600 text-sm mt-2">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
