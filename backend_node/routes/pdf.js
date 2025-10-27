const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");
const authMiddleware = require("../middleware/auth");

// Додайте CORS middleware для OPTIONS запитів
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
};

// Використовуйте CORS для всіх маршрутів
router.use(corsMiddleware);

// Генерація PDF
router.post("/generate", authMiddleware, pdfController.generatePdf);

// Список всіх PDF
router.get("/list", authMiddleware, pdfController.listPdfs);

// Видалення конкретного PDF
router.delete("/:filename", authMiddleware, pdfController.deletePdf);

module.exports = router;