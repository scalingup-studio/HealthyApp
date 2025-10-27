const { renderPdf } = require("../utils/generatePdf");
const path = require("path");
const fs = require("fs-extra");

exports.generatePdf = async (req, res) => {
  try {
    const data = req.body; 
    const pdfPath = path.join(__dirname, "../pdfs", `report-${Date.now()}.pdf`);

    await renderPdf("report.ejs", data, pdfPath);
    res.download(pdfPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

// Повертає список PDF
exports.listPdfs = async (req, res) => {
  try {
    const pdfDir = path.join(__dirname, "../pdfs");
    const files = await fs.readdir(pdfDir);
    const pdfFiles = files.filter(f => f.endsWith(".pdf"));
    res.json({ files: pdfFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list PDFs" });
  }
};

// Видаляє PDF
exports.deletePdf = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../pdfs", filename);

    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    await fs.remove(filePath);
    res.json({ success: true, message: `${filename} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete PDF" });
  }
};
