// controllers/pdfController.js
const { renderPdf } = require("../utils/generatePdf");
const path = require("path");
const fs = require("fs-extra");

// Генерація PDF
exports.generatePdf = async (req, res) => {
  try {
    const data = req.body;
    const pdfDir = path.join(__dirname, "../pdfs");
    await fs.ensureDir(pdfDir);
    
    const pdfPath = path.join(pdfDir, `report-${Date.now()}.pdf`);
    await renderPdf("report.ejs", data, pdfPath);

    res.download(pdfPath);
  } catch (err) {
    console.error("PDF Generation Error:", err);
    res.status(500).json({ error: "Failed to generate PDF", details: err.message });
  }
};

// Приклад: список PDF
exports.listPdfs = async (req, res) => {
  const pdfDir = path.join(__dirname, "../pdfs");
  const files = await fs.readdir(pdfDir);
  res.json(files);
};

// Приклад: видалення PDF
exports.deletePdf = async (req, res) => {
  const { filename } = req.params;
  const pdfPath = path.join(__dirname, "../pdfs", filename);
  await fs.remove(pdfPath);
  res.json({ success: true });
};
