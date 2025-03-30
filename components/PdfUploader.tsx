'use client';

import { useState } from 'react';

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };
  const handleUpload = async () => {
    console.log("PDF Upload triggered"); 
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }
  
    setLoading(true);
    setError(null);
    setExtractedText('');
    
    try {
      // Convert file to base64
      const base64 = await convertToBase64(file);
      
      // Send to API
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfBase64: base64 }),
      });
      
      const data = await response.json();
      console.log(response,"res")
      
      if (!response.ok) {
        throw new Error(data.message || 'Error processing PDF');
      }
      
      setExtractedText(data.text);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      
      // Type narrowing to handle errors properly
      if (err instanceof Error) {
        setError(err.message || 'Error uploading and processing PDF');
      } else {
        setError('Unknown error occurred during file upload');
      }
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg border shadow-sm">
      <h2 className="text-xl font-bold mb-4">PDF Text Extractor</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select PDF File
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium
                  ${!file || loading ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Extracting Text...' : 'Extract Text'}
      </button>
      
      {extractedText && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Extracted Text:</h3>
          <div className="p-3 bg-gray-50 rounded-md border text-sm whitespace-pre-wrap max-h-96 overflow-auto">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
}