const pdfParse = require("pdf-parse");
const fs = require("fs");
const mammoth = require("mammoth");

async function extractText(filePath, mimeType) {
  try {
    if (mimeType.includes("pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text.toLowerCase();
    }

    if (mimeType.includes("word")) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.toLowerCase();
    }

    return "";
  } catch (err) {
    console.error("Resume parsing failed:", err.message);
    return "";
  }
}

module.exports = extractText;
