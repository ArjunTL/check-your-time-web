// lib/custom-pdf-parse.js 
const pdfParse = require('pdf-parse'); // Import the pdf-parse library

async function parsePDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer); // Parse the PDF buffer
    return data;  // Return the parsed data, including extracted text
  } catch (error) {
    console.error('Error parsing PDF:', error);  // Handle any parsing errors
    throw new Error('Failed to parse PDF');
  }
}

module.exports = parsePDF; // Export the parsePDF function for use in other files
