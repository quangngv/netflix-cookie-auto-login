const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '5mb' }));

app.listen(PORT, () => {
  console.log(`\n  🎬 Netflix Cookie Login Server`);
  console.log(`  ────────────────────────────────`);
  console.log(`  🌐 Mở trình duyệt: http://localhost:${PORT}`);
  console.log(`  📦 Extension:       ./extension/ (load vào Chrome)\n`);
});

