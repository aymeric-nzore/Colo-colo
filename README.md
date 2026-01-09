# Colo-colo

Un projet full-stack avec Django REST Framework (backend) et React + TypeScript (frontend).

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.8+** - [Télécharger Python](https://www.python.org/downloads/)
- **Node.js 18+** et **npm** - [Télécharger Node.js](https://nodejs.org/)
- **pip** (gestionnaire de paquets Python)

## 🚀 Installation et Lancement

### 1. Cloner le Projet

```bash
git clone https://github.com/aymeric-nzore/Colo-colo.git
cd Colo-colo
```

### 2. Configuration du Backend (Django)

#### Installation des dépendances Python

Il est recommandé d'utiliser un environnement virtuel :

```bash
cd backend
python -m venv venv
# Sur Windows :
venv\Scripts\activate
# Sur macOS/Linux :
source venv/bin/activate

pip install -r requirements.txt
```

Ou installation globale (non recommandé) :

```bash
cd backend
pip install -r requirements.txt
```

#### Initialiser la base de données

```bash
python manage.py migrate
```

#### Créer un superutilisateur (optionnel)

```bash
python manage.py createsuperuser
```

#### Lancer le serveur backend

```bash
python manage.py runserver
```

Le backend sera accessible sur : **http://localhost:8000**

### 3. Configuration du Frontend (React + Vite)

Ouvrez un nouveau terminal :

#### Installation des dépendances npm

```bash
cd frontend
npm install
```

#### Lancer le serveur de développement

```bash
npm run dev
```

Le frontend sera accessible sur : **http://localhost:5173**

## 🔧 Configuration

### Backend

- **Port par défaut** : 8000
- **Admin Django** : http://localhost:8000/admin
- **API** : http://localhost:8000/api

### Frontend

- **Port par défaut** : 5173
- **URL de l'API backend** : Configurée dans `frontend/.env`

Le fichier `.env` du frontend contient :
```
VITE_API_URL=http://localhost:8000/api
```

## 📝 Scripts Disponibles

### Backend

```bash
# Lancer le serveur de développement
python manage.py runserver

# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser
```

### Frontend

```bash
# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linter le code
npm run lint
```

## 🛠️ Technologies Utilisées

### Backend
- Django 6.0.1
- Django REST Framework
- Django CORS Headers

### Frontend
- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- TailwindCSS + DaisyUI
- React Router
- Zustand (state management)
- React Query (TanStack Query)

## 📚 Structure du Projet

```
Colo-colo/
├── backend/           # API Django REST Framework
│   ├── api/          # Application API
│   ├── backend/      # Configuration Django
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # Application React
│   ├── src/         # Code source
│   ├── public/      # Fichiers statiques
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🐛 Dépannage

### Le backend ne démarre pas

1. Vérifiez que Python 3.8+ est installé : `python --version`
2. Assurez-vous que toutes les dépendances sont installées : `pip install -r requirements.txt`
3. Vérifiez que les migrations sont appliquées : `python manage.py migrate`

### Le frontend ne démarre pas

1. Vérifiez que Node.js est installé : `node --version`
2. Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`
3. Vérifiez que le fichier `.env` existe dans le dossier `frontend/`

### Erreurs CORS

Si vous rencontrez des erreurs CORS lors de la communication entre le frontend et le backend, vérifiez que :
- Le backend a `django-cors-headers` installé
- L'URL de l'API dans `frontend/.env` est correcte

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
