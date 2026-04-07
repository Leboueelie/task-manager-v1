# Task Manager V1

Application de gestion de tâches full-stack avec Django REST Framework et React.

## 🏗 Architecture
task-manager-v1/
├── backend/              # Django 5 + DRF + PostgreSQL
│   ├── apps/tasks/       # API Tâches (CRUD complet)
│   └── config/           # Configuration Django
├── frontend/             # React 18 + Vite + JavaScript
│   ├── src/components/   # Composants UI
│   ├── src/hooks/        # TanStack Query hooks
│   ├── src/schemas/      # Validation Zod
│   └── src/services/     # Client API Axios
└── docker-compose.yml    # PostgreSQL 16

## 🛠 Stack Technique

| Couche | Technologie |
|--------|-------------|
| Backend | Django 5.x, Django REST Framework, PostgreSQL |
| Frontend | React 18, Vite, JavaScript |
| State Management | TanStack Query (React Query) |
| Formulaires | React Hook Form + Zod |
| HTTP Client | Axios |
| Database | PostgreSQL 16 (Docker) |
| Validation | Zod (client), DRF Serializers (serveur) |

## 🚀 Démarrage Rapide

### Prérequis

- Python 3.11+
- Node.js 18+
- Docker Desktop

### 1. Démarrer la base de données

```bash
docker-compose up -d
2. Backend
bash
Copy
cd backend

# Créer l'environnement virtuel (la première fois)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Installer les dépendances
pip install -r requirements.txt

# Copier et configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos valeurs

# Migrations
python manage.py migrate

# Lancer le serveur
python manage.py runserver
API disponible sur http://localhost:8000/api/
3. Frontend
bash
Copy
cd frontend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
Application disponible sur http://localhost:5173
📡 API Endpoints
Table
Méthode	Endpoint	Description
GET	/api/tasks/	Lister toutes les tâches
POST	/api/tasks/	Créer une tâche
GET	/api/tasks/{id}/	Détails d'une tâche
PATCH	/api/tasks/{id}/	Modifier une tâche
DELETE	/api/tasks/{id}/	Supprimer une tâche
PATCH	/api/tasks/{id}/toggle/	Basculer le statut todo/done
Filtres et tri
?status=todo|done - Filtrer par statut
?priority=low|medium|high - Filtrer par priorité
?ordering=due_date|priority|created_at - Trier les résultats
📝 Schéma de la base de données
Table : tasks_task
Table
Champ	Type	Description
id	BIGINT	Clé primaire
title	VARCHAR(200)	Titre obligatoire
description	TEXT	Description optionnelle
priority	VARCHAR(10)	low/medium/high (défaut: medium)
status	VARCHAR(10)	todo/done (défaut: todo)
due_date	DATE	Date limite (optionnelle)
created_at	TIMESTAMP	Date de création
updated_at	TIMESTAMP	Date de modification
✅ Fonctionnalités MVP
[x] Créer une tâche (titre, description, priorité, statut, date limite)
[x] Lister les tâches avec filtres (statut) et tri
[x] Modifier une tâche (formulaire pré-rempli)
[x] Supprimer une tâche avec confirmation
[x] Toggle rapide du statut (todo/done)
[x] Validation côté client (Zod) et serveur (DRF)
[x] Notifications Toast (succès/erreur)
[x] Interface responsive
🚫 Hors périmètre V1
Authentification utilisateurs
Tests automatisés
Déploiement cloud
WebSockets temps réel
Upload de fichiers
(Prévus pour les projets #5 à #10)
🧪 Test avec REST Client
Le fichier api.http à la racine contient toutes les requêtes de test.
Utilise l'extension REST Client de VS Code pour l'exécuter.
🐛 Dépannage
Problème : django_filters non trouvé
bash
Copy
pip install django-filter
Problème : CORS error dans le navigateur
Vérifie que CORS_ALLOWED_ORIGINS dans backend/config/settings.py contient bien http://localhost:5173
Problème : PostgreSQL ne démarre pas
bash
Copy
docker-compose down
docker-compose up -d
👨‍💻 Auteur
Projet pédagogique - Task Manager V1
plain
Copy

---

### Étape 10.2 : Créer le README backend

Dans `backend/`, crée `README.md` :

```markdown
# Backend - Task Manager V1

## Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Configurer .env

python manage.py migrate
python manage.py runserver
Commandes utiles
bash
Copy
# Lancer le serveur
python manage.py runserver

# Nouvelle migration
python manage.py makemigrations

# Appliquer migrations
python manage.py migrate

# Shell Django
python manage.py shell

# Créer superuser
python manage.py createsuperuser
Structure
config/ : Configuration Django (settings, urls, wsgi)
apps/tasks/ : Application métier (models, views, serializers, urls)
plain
Copy

---

### Étape 10.3 : Créer le README frontend

Dans `frontend/`, crée `README.md` :

```markdown
# Frontend - Task Manager V1

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
Structure
plain
Copy
src/
├── components/     # Composants React
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   ├── TaskForm.jsx
│   ├── Toast.jsx
│   └── ConfirmModal.jsx
├── hooks/          # TanStack Query hooks
│   ├── useTasks.js
│   └── useToast.js
├── schemas/        # Validation Zod
│   └── taskSchema.js
└── services/       # API client
    └── api.js
Commandes
bash
Copy
npm run dev      # Développement
npm run build    # Build production
npm run preview  # Preview production
plain
Copy

---

### Étape 10.4 : Initialiser Git et faire le premier commit

```bash
# Dans task-manager-v1/
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "feat: MVP Task Manager V1 complet
- Backend Django + DRF + PostgreSQL
- Frontend React + Vite + TanStack Query
- CRUD tâches avec validation Zod
- Notifications Toast et confirmations
- Documentation complète"

# Créer le tag de version
git tag -a v1.0.0 -m "Version 1.0.0 - MVP Task Manager"
Étape 10.5 : Vérifier le statut Git
bash
Copy
git log --oneline
# Doit afficher : feat: MVP Task Manager V1 complet

git tag
# Doit afficher : v1.0.0
Étape 10.6 : Checklist finale de validation
Table
#	Critère	Status
1	API répond sur tous les verbes HTTP	✅
2	PostgreSQL utilisé (pas SQLite)	✅
3	Frontend gère loading, success, error	✅
4	Validation Zod + DRF fonctionne	✅
5	Pas de console.log en production	✅
6	Pas de print() en production	✅
7	README.md clair à la racine	✅
8	Schéma DB documenté	✅
9	Commandes de lancement documentées	✅
10	Repo propre avec .gitignore	✅
11	Git tag v1.0.0 créé	✅
Étape 10.7 : Test de l'application complète
Fais un dernier test end-to-end :
Arrête tout (Ctrl+C dans tous les terminaux)
Relance depuis zéro :
bash
Copy
# Terminal 1
docker-compose up -d

# Terminal 2  
cd backend
venv\Scripts\activate
python manage.py runserver

# Terminal 3
cd frontend
npm run dev
Teste dans le navigateur :
http://localhost:5173
Crée 3 tâches
Modifie-en une
Supprime-en une
Toggle le statut
Vérifie les filtres