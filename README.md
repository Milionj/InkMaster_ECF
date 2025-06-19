
# InkMaster_ECF 🎨🖥️

Projet de développement d'une application web complète pour le salon de tatouage **InkMaster** dans le cadre de l'évaluation du titre professionnel **Développeur Web & Web Mobile (DWWM)**.

## 🧩 Objectif

Créer une application immersive et fonctionnelle répondant aux besoins des visiteurs, des artistes tatoueurs et de l'administrateur du salon.

## 🚀 Stack Technique

- **Front-end** : HTML5, CSS (Tailwind/Bootstrap), JavaScript, React.js
- **Back-end** : Node.js, Express.js
- **Base de données** : MySQL (relationnelle) + Firebase ou MongoDB (NoSQL)
- **Outils** : Docker, GitHub, GitHub Projects, GitHub CLI

## 📌 Structure de gestion du projet

### 🗂️ Tableau Kanban GitHub Projects (classic)

Colonnes recommandées :
- `Backlog`
- `À faire`
- `En cours`
- `À valider`
- `Terminé (develop)`
- `Déployé (main)`

---

## ✅ Scripts disponibles

### 🎯 1. Créer les issues automatiquement

Fichier : `create_issues_inkmaster.sh`

```bash
chmod +x create_issues_inkmaster.sh
./create_issues_inkmaster.sh
```

> Ce script crée toutes les issues du projet à partir du cahier des charges (User Stories, tâches techniques, etc.)

### 🏷️ 2. Créer les labels automatiquement

Fichier : `create_labels_inkmaster.sh`

```bash
chmod +x create_labels_inkmaster.sh
./create_labels_inkmaster.sh
```

> Ce script ajoute tous les labels nécessaires pour trier et organiser les issues dans le Kanban GitHub.

---

## 🔒 Authentification requise

Ces scripts utilisent **GitHub CLI**, assure-toi d’être connecté :

```bash
gh auth login
```

---

## 📁 Organisation recommandée

- `/front` → projet React
- `/back` → API Node/Express
- `/docker` → fichiers `Dockerfile` et `docker-compose.yml`
- `/docs` → maquettes, MCD, UML, README, présentations

---

## 📎 Liens utiles

- [Tableau Kanban GitHub](https://github.com/Milionj/InkMaster_ECF/projects)
- [Labels GitHub](https://github.com/Milionj/InkMaster_ECF/labels)
- [Issues](https://github.com/Milionj/InkMaster_ECF/issues)

---

## 👤 Auteur

Projet développé par **Demba Soumaré** (alias Webs) – Session ECF 2025
