// Polyfill minimal `File` global for Node versions that don't provide it (Node 18)
if (typeof global.File === 'undefined') {
  global.File = class File {
    constructor(parts = [], name = 'file') {
      this.parts = parts;
      this.name = name;
    }
  };
}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const scrape = require('./scraper/scrape');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));

// Trigger scrape via API
app.post('/api/scrape', async (req, res) => {
  try {
    await scrape();
    return res.json({ message: 'Scrape completed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Start server only after DB connection and initial scrape
(async function start(){
  try {
    await connectDB();
    try {
      await scrape();
      console.log('Initial scrape complete');
    } catch (err) {
      console.error('Scrape error', err.message || err);
    }
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err.message || err);
    process.exit(1);
  }
})();
