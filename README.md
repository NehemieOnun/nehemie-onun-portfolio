# Portfolio — Néhémie Onun

Site portfolio bilingue (FR/EN) avec mode clair/sombre et un **tableau de bord** (`/admin`) pour :

- publier des **actualités**, des **articles de blog**, des **événements**, des **albums photo** et des **documents** (PDF…) ;
- modifier le profil, les liens, les projets, les compétences, le parcours et les certifications ;
- lire les messages du formulaire de contact et suivre les visites (statistiques anonymes).

Pages publiques : `/`, `/actualites`, `/blog`, `/evenements`, `/galerie`, `/documents`, `/cv`.

- Frontend : React 19, Vite, Tailwind CSS 4
- Backend : Express (local) / fonction serverless (Vercel)
- Données : PostgreSQL **Neon** en production, fichier local en développement
- Assistant IA : Gemini (facultatif)

## 1. Lancer en local

Prérequis : Node.js 20 ou plus.

```powershell
npm install
copy .env.example .env     # (macOS/Linux : cp .env.example .env)
```

Dans `.env`, renseignez au minimum `ADMIN_PASSWORD` (8 caractères minimum), puis :

```powershell
npm run dev
```

- Site : http://localhost:3000
- Tableau de bord : http://localhost:3000/admin

Sans `DATABASE_URL`, le contenu est enregistré dans `data/local-db.json` (ignoré par Git).

## 2. Mettre en ligne sur Vercel + Neon

1. **Neon** : créez un projet sur https://neon.tech et copiez la chaîne de connexion (*Connection string*). Les tables sont créées automatiquement au premier lancement.
2. **GitHub** : poussez ce dossier dans un dépôt.
3. **Vercel** : *Add New → Project*, importez le dépôt. La configuration est lue depuis `vercel.json`.
4. Dans *Settings → Environment Variables* (cochez *Production*), ajoutez :

| Variable | Obligatoire | Valeur |
| --- | --- | --- |
| `DATABASE_URL` | oui | chaîne de connexion Neon |
| `ADMIN_PASSWORD` | oui | votre mot de passe admin (long) |
| `SESSION_SECRET` | oui | 32 caractères aléatoires (voir ci-dessous) |
| `GEMINI_API_KEY` | non | clé https://aistudio.google.com/apikey |
| `GEMINI_MODEL` | non | `gemini-3.8-flash` par défaut |
| `VITE_CLOUDINARY_CLOUD_NAME` | non | téléversement d'images |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | non | préréglage *unsigned* Cloudinary |

Générer `SESSION_SECRET` :

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Redéployez. Connectez-vous sur `https://votre-site.vercel.app/admin`.

> Les variables `VITE_…` sont intégrées au moment du build : redéployez après les avoir modifiées.

## 3. Téléverser des images (facultatif)

Sans configuration, collez simplement l'adresse d'une image. Pour téléverser depuis l'ordinateur :

1. Créez un compte gratuit sur https://cloudinary.com.
2. *Settings → Upload → Upload presets → Add upload preset*, mode **Unsigned**.
3. Renseignez `VITE_CLOUDINARY_CLOUD_NAME` et `VITE_CLOUDINARY_UPLOAD_PRESET`.

## 4. Organisation du code

| Dossier | Contenu |
| --- | --- |
| `shared/` | Types, contenu par défaut, fonctions communes (site, admin, serveur) |
| `server/` | API : contenu public, blog, contact, assistant IA, authentification, tableau de bord |
| `api/index.ts` | Point d'entrée Vercel |
| `server.ts` | Serveur local (`npm run dev`, `npm start`) |
| `src/site/`, `src/pages/` | Site public |
| `src/admin/` | Tableau de bord |

Le contenu de `shared/defaults.ts` n'est utilisé que tant que rien n'a été enregistré depuis `/admin`.

## 5. Sécurité

- Le mot de passe admin n'est jamais envoyé au navigateur ; la session est un cookie `HttpOnly` signé, valable 7 jours.
- Connexions, messages de contact et questions à l'IA sont limités en nombre par visiteur.
- Le contenu des articles (Markdown) est nettoyé avant affichage : aucun script ne peut y être injecté.
- Ne partagez jamais votre fichier `.env`.
