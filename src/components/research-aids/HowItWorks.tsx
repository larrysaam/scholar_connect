
const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-3">Post Your Task</h3>
              <p className="text-gray-600 text-sm">Describe the help you need and available budget: editing a thesis chapter, analysing survey data, designing a map, etc.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-3">Get Matched</h3>
              <p className="text-gray-600 text-sm">Browse expert profiles or receive suggested matches based on your task type.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-3">Hire & Collaborate</h3>
              <p className="text-gray-600 text-sm">Agree on price and timeline. Chat, share documents, and track progress right from your dashboard. Then make payment before they commence work.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-lg font-semibold mb-3">Approve & Review</h3>
              <p className="text-gray-600 text-sm">Once the job is complete, approve delivery and leave a rating. The expert gets paid, you get results.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
