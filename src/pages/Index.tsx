
import PublicationScheduler from "@/components/PublicationScheduler";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Publication Scheduler</h1>
        <PublicationScheduler />
      </div>
    </div>
  );
};

export default Index;
