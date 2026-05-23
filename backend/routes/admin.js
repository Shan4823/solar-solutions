const router = require('express').Router();
const db     = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All routes in this file require admin
router.use(authenticate, requireAdmin);

// ── GET /api/admin/users ─────────────────────────────────────
router.get('/users', async (req, res) => {
  const { search } = req.query;
  let sql = `
    SELECT u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.created_at,
           COUNT(a.id) AS application_count
    FROM users u
    LEFT JOIN applications a ON a.user_id = u.id
    WHERE u.role = 'user'`;
  const params = [];
  if (search) {
    sql += ' AND (u.full_name LIKE ? OR u.email LIKE ?)';
    const q = `%${search}%`;
    params.push(q, q);
  }
  sql += ' GROUP BY u.id ORDER BY u.created_at DESC';
  const [rows] = await db.query(sql, params);
  res.json(rows);
});

// ── PATCH /api/admin/users/:id/deactivate ────────────────────
router.patch('/users/:id/deactivate', async (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'Cannot deactivate your own account' });

  await db.query(
    'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ? AND role = "user"',
    [req.params.id]
  );
  res.json({ message: 'User deactivated' });
});

// ── PATCH /api/admin/users/:id/activate ─────────────────────
router.patch('/users/:id/activate', async (req, res) => {
  await db.query(
    'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id = ?',
    [req.params.id]
  );
  res.json({ message: 'User activated' });
});

// ── DELETE /api/admin/users/:id ──────────────────────────────
router.delete('/users/:id', async (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'Cannot delete your own account' });

  await db.query('DELETE FROM users WHERE id = ? AND role = "user"', [req.params.id]);
  res.json({ message: 'User removed' });
});

// ── GET /api/admin/stats ─────────────────────────────────────
router.get('/stats', async (req, res) => {
  const [[users]]   = await db.query('SELECT COUNT(*) AS cnt FROM users WHERE role="user"');
  const [[apps]]    = await db.query('SELECT COUNT(*) AS cnt FROM applications');
  const [[pending]] = await db.query('SELECT COUNT(*) AS cnt FROM applications WHERE status="pending"');
  const [[approved]]= await db.query('SELECT COUNT(*) AS cnt FROM applications WHERE status="approved"');
  const [[rejected]]= await db.query('SELECT COUNT(*) AS cnt FROM applications WHERE status="rejected"');
  res.json({
    total_users:      users.cnt,
    total_apps:       apps.cnt,
    pending_apps:     pending.cnt,
    approved_apps:    approved.cnt,
    rejected_apps:    rejected.cnt,
  });
});

module.exports = router;

// ── POST /api/admin/create-admin ─────────────────────────────
// Logged-in admin can create another admin account
router.post('/create-admin', async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ message: 'full_name, email and password are required' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const bcrypt = require('bcryptjs');
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 12);
    await db.query(
      'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email.toLowerCase(), phone || null, hash, 'admin']
    );
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
