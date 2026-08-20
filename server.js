require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' })); // marge pour photo + signature en base64

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!process.env.DATABASE_URL) {
  console.error('ERREUR : la variable d\'environnement DATABASE_URL est manquante.');
}
if (!JWT_SECRET) {
  console.error('ERREUR : la variable d\'environnement JWT_SECRET est manquante.');
}
if (!ADMIN_PASSWORD_HASH) {
  console.error('ERREUR : la variable d\'environnement ADMIN_PASSWORD_HASH est manquante.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const REQUIRED_FIELDS = [
  'nomComplet', 'dob', 'tel', 'ville',
  'pourquoi', 'objectifs', 'experience', 'heuresParSemaine',
  'signature', 'dateSignature'
];

// ---------- Public : soumission d'une candidature ----------
app.post('/api/candidatures', async (req, res) => {
  try {
    const r = req.body || {};
    for (const field of REQUIRED_FIELDS) {
      if (!r[field] || String(r[field]).trim() === '') {
        return res.status(400).json({ error: `Champ manquant : ${field}` });
      }
    }
    const result = await pool.query(
      `INSERT INTO candidatures
        (photo, nom_complet, dob, tel, adresse, ville, email, pourquoi, objectifs,
         experience, heures_semaine, signature, date_signature, submitted_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, now())
       RETURNING id, submitted_at`,
      [
        r.photo || null, r.nomComplet, r.dob, r.tel, r.adresse || null,
        r.ville, r.email || null, r.pourquoi, r.objectifs,
        r.experience, r.heuresParSemaine, r.signature, r.dateSignature
      ]
    );
    res.json({ ok: true, id: result.rows[0].id, submittedAt: result.rows[0].submitted_at });
  } catch (err) {
    console.error('Erreur /api/candidatures :', err.message);
    res.status(500).json({ error: 'Erreur serveur, merci de réessayer.' });
  }
});

// ---------- Admin : connexion ----------
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password || !ADMIN_PASSWORD_HASH) {
      return res.status(400).json({ error: 'Requête invalide' });
    }
    const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!ok) return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error('Erreur /api/admin/login :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Non authentifié' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Session expirée, merci de vous reconnecter.' });
  }
}

// ---------- Admin : liste des candidatures (protégée) ----------
app.get('/api/admin/candidatures', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, photo, nom_complet, dob, tel, adresse, ville, email,
              pourquoi, objectifs, experience, heures_semaine, signature,
              date_signature, submitted_at
       FROM candidatures ORDER BY submitted_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur /api/admin/candidatures :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MAMA Group backend en écoute sur le port ${PORT}`));
