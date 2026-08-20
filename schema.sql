-- À exécuter une seule fois dans l'éditeur SQL de Supabase (ou tout Postgres)
CREATE TABLE IF NOT EXISTS candidatures (
  id SERIAL PRIMARY KEY,
  photo TEXT,
  nom_complet TEXT NOT NULL,
  dob DATE NOT NULL,
  tel TEXT NOT NULL,
  adresse TEXT,
  ville TEXT NOT NULL,
  email TEXT,
  pourquoi TEXT NOT NULL,
  objectifs TEXT NOT NULL,
  experience TEXT NOT NULL,
  heures_semaine TEXT NOT NULL,
  signature TEXT NOT NULL,
  date_signature DATE NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
