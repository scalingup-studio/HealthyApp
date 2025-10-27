const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");

// Генерація PDF
router.post("/generate", pdfController.generatePdf);

// Список всіх PDF
router.get("/list", pdfController.listPdfs);

// Видалення конкретного PDF
router.delete("/:filename", pdfController.deletePdf);

module.exports = router;
