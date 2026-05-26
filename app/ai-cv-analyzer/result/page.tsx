import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CVResultPage from "@/components/CVResultPage";

export default function AICVAnalyzerResultPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <CVResultPage />
      <Footer />
    </div>
  );
}
