
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProviderEarningsPage from "@/components/payment/ProviderEarningsPage";

const ProviderEarnings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <ProviderEarningsPage />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderEarnings;
