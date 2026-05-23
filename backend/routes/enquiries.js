const router = require('express').Router();
const db     = require('../config/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

async function nextRef() {
  const [rows] = await db.query('SELECT COUNT(*) AS cnt FROM enquiries');
  return `ENQ-${String(rows[0].cnt + 1).padStart(4, '0')}`;
}

// ── POST /api/enquiries  (PUBLIC – no login needed) ──────────
router.post('/', async (req, res) => {
  const {
    enquiry_type, name, phone, email, city, notes,
    state, monthly_bill, roof_type,
    company_name, contact_person, business_type,
  } = req.body;

  if (!enquiry_type) return res.status(400).json({ message: 'enquiry_type is required' });
  if (enquiry_type === 'residential' && !name)
    return res.status(400).json({ message: 'Full name is required' });
  if (enquiry_type === 'commercial' && !company_name)
    return res.status(400).json({ message: 'Company name is required' });
  if (!phone) return res.status(400).json({ message: 'Phone number is required' });

  try {
    const ref = await nextRef();
    await db.query(
      `INSERT INTO enquiries
       (reference_no, enquiry_type, name, phone, email, city, notes,
        state, monthly_bill, roof_type, company_name, contact_person, business_type)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [ref, enquiry_type,
       name||null, phone||null, email||null, city||null, notes||null,
       state||null, monthly_bill||null, roof_type||null,
       company_name||null, contact_person||null, business_type||null]
    );
    res.status(201).json({ message: 'Enquiry submitted successfully', reference_no: ref });
  } catch (err) {
    console.error('Enquiry POST error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── GET /api/enquiries  (Admin only) ─────────────────────────
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM enquiries WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (search) {
      sql += ' AND (name LIKE ? OR company_name LIKE ? OR phone LIKE ? OR email LIKE ? OR reference_no LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q, q, q);
    }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Enquiry GET error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PATCH /api/enquiries/:id/status  (Admin only) ────────────
router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    const valid = ['new', 'contacted', 'converted', 'closed'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    await db.query(
      'UPDATE enquiries SET status = ?, admin_note = ?, updated_at = NOW() WHERE id = ?',
      [status, admin_note || null, req.params.id]
    );
    res.json({ message: 'Enquiry updated' });
  } catch (err) {
    console.error('Enquiry PATCH error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
