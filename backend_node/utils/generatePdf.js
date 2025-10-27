const puppeteer = require("puppeteer");
const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path");

exports.renderPdf = async (templateName, data, outputPath) => {
  // Рендеримо EJS в HTML
  const templatePath = path.join(__dirname, "../templates", templateName);
  const html = await ejs.renderFile(templatePath, data, { async: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: outputPath, format: "A4" });

  await browser.close();
};
