const router = require('express').Router();
const db     = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Helper: generate reference number
async function nextRef() {
  const [rows] = await db.query('SELECT COUNT(*) AS cnt FROM applications');
  return `SR-${String(rows[0].cnt + 1).padStart(4, '0')}`;
}

// ── POST /api/applications  (user submits) ───────────────────
router.post('/', authenticate, async (req, res) => {
  const {
    app_type, city, state, monthly_bill, roof_type, notes,
    company_name, contact_person, business_type,
    system_size, subsidy_amount,
  } = req.body;

  if (!app_type) return res.status(400).json({ message: 'app_type is required' });

  try {
    const ref = await nextRef();
    await db.query(
      `INSERT INTO applications
       (reference_no, user_id, app_type, city, state, monthly_bill, roof_type, notes,
        company_name, contact_person, business_type, system_size, subsidy_amount)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        ref, req.user.id, app_type,
        city || null, state || null, monthly_bill || null,
        roof_type || null, notes || null,
        company_name || null, contact_person || null, business_type || null,
        system_size || null, subsidy_amount || null,
      ]
    );
    res.status(201).json({ message: 'Application submitted', reference_no: ref });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/applications/mine  (logged-in user's own apps) ──
router.get('/mine', authenticate, async (req, res) => {
  const [rows] = await db.query(
    `SELECT id, reference_no, app_type, city, company_name, system_size,
            subsidy_amount, status, created_at
     FROM applications WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// ── GET /api/applications  (admin: all applications) ─────────
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { status, search } = req.query;
  let sql = `
    SELECT a.id, a.reference_no, a.app_type, a.city, a.state, a.company_name,
           a.contact_person, a.system_size, a.subsidy_amount, a.status,
           a.admin_note, a.created_at,
           u.full_name, u.email, u.phone
    FROM applications a
    JOIN users u ON u.id = a.user_id
    WHERE 1=1`;
  const params = [];

  if (status) { sql += ' AND a.status = ?'; params.push(status); }
  if (search) {
    sql += ' AND (u.full_name LIKE ? OR a.reference_no LIKE ? OR u.email LIKE ?)';
    const q = `%${search}%`;
    params.push(q, q, q);
  }
  sql += ' ORDER BY a.created_at DESC';

  const [rows] = await db.query(sql, params);
  res.json(rows);
});

// ── PATCH /api/applications/:id  (admin: approve/reject + note) ─
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  const { status, admin_note } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  await db.query(
    `UPDATE applications
     SET status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW()
     WHERE id = ?`,
    [status, admin_note || null, req.user.id, req.params.id]
  );
  res.json({ message: `Application ${status}` });
});

module.exports = router;
