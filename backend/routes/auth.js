const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');
const { authenticate } = require('../middleware/auth');

// ── POST /api/auth/register ──────────────────────────────────
router.post('/register', async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ message: 'full_name, email and password are required' });

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email.toLowerCase(), phone || null, hash, 'user']
    );

    const token = jwt.sign(
      { id: result.insertId, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: { id: result.insertId, full_name, email, role: 'user' },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'email and password are required' });

  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, password_hash, role, is_active FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.is_active) return res.status(403).json({ message: 'Account is deactivated' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
});

module.exports = router;

// ── PATCH /api/auth/profile  (update name, email, phone) ────
router.patch('/profile', authenticate, async (req, res) => {
  const { full_name, email, phone } = req.body;
  if (!full_name || !email)
    return res.status(400).json({ message: 'full_name and email are required' });

  try {
    // Check email not taken by someone else
    const [clash] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email.toLowerCase(), req.user.id]
    );
    if (clash.length) return res.status(409).json({ message: 'Email already in use by another account' });

    await db.query(
      'UPDATE users SET full_name = ?, email = ?, phone = ?, updated_at = NOW() WHERE id = ?',
      [full_name, email.toLowerCase(), phone || null, req.user.id]
    );

    const [rows] = await db.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ message: 'Profile updated', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PATCH /api/auth/password  (change password) ─────────────
router.patch('/password', authenticate, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ message: 'current_password and new_password are required' });
  if (new_password.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters' });

  try {
    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    const hash = await bcrypt.hash(new_password, 12);
    await db.query('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?', [hash, req.user.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── DELETE /api/auth/account  (self-delete account) ─────────
router.delete('/account', authenticate, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password required to delete account' });

  try {
    const [rows] = await db.query('SELECT password_hash, role FROM users WHERE id = ?', [req.user.id]);
    if (rows[0].role === 'admin')
      return res.status(403).json({ message: 'Admin accounts cannot be self-deleted' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    await db.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
