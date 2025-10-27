const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');

module.exports = async (data, outputPath) => {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(__dirname, '../templates/report.ejs');

    ejs.renderFile(templatePath, { data }, (err, html) => {
      if (err) return reject(err);

      pdf.create(html).toFile(outputPath, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};
