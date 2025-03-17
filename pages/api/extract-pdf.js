import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // The PDF file should be sent as base64 in the request body
    const { pdfBase64 } = req.body;
    
    if (!pdfBase64) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Get the base64 data part (remove the data:application/pdf;base64, part if present)
    const base64Data = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
    
    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    
    // Parse PDF
    const data = await pdf(pdfBuffer);
    
    // Extract text from PDF
    const text = data.text;
    
    return res.status(200).json({ 
      message: 'PDF text extracted successfully', 
      text: text
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return res.status(500).json({ message: 'Error processing PDF', error: error.message });
  }
}