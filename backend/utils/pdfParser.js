const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    if (ext === '.pdf') {
      return await extractFromPDF(filePath);
    } else if (ext === '.docx' || ext === '.doc') {
      return await extractFromWord(filePath);
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from file');
  }
}

async function extractFromPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractFromWord(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

module.exports = { extractTextFromFile };