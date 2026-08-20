# MAMA Group — Formulaire d'intégration (site autonome)

Un vrai site web, indépendant de Claude : formulaire public + base de données + panneau admin protégé par mot de passe.

## Ce que contient ce dossier
- `server.js` — le serveur (API + sert le formulaire)
- `public/index.html` — le formulaire que voient les candidats
- `public/admin.html` — ton panneau privé (protégé par mot de passe)
- `schema.sql` — la structure de la base de données à créer une fois
- `hash-password.js` — outil pour créer ton mot de passe admin en toute sécurité

## Étape 1 — Créer la base de données (gratuit, 5 min)
1. Va sur https://supabase.com et crée un compte, puis un nouveau projet.
2. Une fois le projet créé, ouvre **SQL Editor** dans le menu de gauche.
3. Colle le contenu de `schema.sql` et clique sur **Run**. Ça crée la table `candidatures`.
4. Va dans **Project Settings > Database > Connection string**, onglet **URI**. Copie cette adresse — c'est ta `DATABASE_URL`.

## Étape 2 — Choisir ton mot de passe admin
Sur ton ordinateur, dans ce dossier :
```
npm install
node hash-password.js "ton_mot_de_passe_ici"
```
Ça t'affiche une ligne `ADMIN_PASSWORD_HASH=...` — garde-la, tu en as besoin à l'étape suivante. Ton mot de passe en clair n'est stocké nulle part.

## Étape 3 — Déployer (gratuit, Render.com)
1. Mets ce dossier sur GitHub (crée un nouveau dépôt, pousse ces fichiers).
2. Va sur https://render.com, crée un compte, clique **New > Web Service**, connecte ton dépôt GitHub.
3. Render détecte Node automatiquement. Configure :
   - **Build command** : `npm install`
   - **Start command** : `npm start`
4. Dans l'onglet **Environment**, ajoute ces trois variables :
   - `DATABASE_URL` → celle copiée à l'étape 1
   - `JWT_SECRET` → n'importe quelle longue phrase aléatoire (ex: génère-en une sur https://randomkeygen.com)
   - `ADMIN_PASSWORD_HASH` → celle générée à l'étape 2
5. Clique **Create Web Service**. Render te donne une adresse du type `https://mama-group.onrender.com`.

## Étape 4 — Utiliser le site
- **Formulaire pour les candidats** : `https://ton-adresse.onrender.com/`
- **Ton panneau admin** : `https://ton-adresse.onrender.com/admin.html`

Partage uniquement la première adresse aux candidats. Garde `/admin.html` et ton mot de passe pour toi seul.

## Ensuite (optionnel)
- **Nom de domaine personnalisé** : dans Render, onglet **Settings > Custom Domains**, tu peux relier un domaine que tu achètes (ex. mamagroup.com).
- **Sauvegardes** : Supabase conserve tes données automatiquement ; tu peux aussi exporter la table depuis l'éditeur SQL à tout moment.
