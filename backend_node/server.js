const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pdfRoutes = require('./routes/pdf');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`PDF service running on http://localhost:${PORT}`);
});
