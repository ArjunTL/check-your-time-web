// pages/extract-pdf.js
import PdfUploader from '../components/PdfUploader';

export default function ExtractPdfPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">PDF Text Extractor</h1>
      <PdfUploader />
    </div>
  );
}