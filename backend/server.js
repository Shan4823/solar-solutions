require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/enquiries',    require('./routes/enquiries'));
app.use('/api/admin',        require('./routes/admin'));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ── 404 handler ──────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

// ── Global error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🌞 Solar Solutions API running on http://localhost:${PORT}\n`));
