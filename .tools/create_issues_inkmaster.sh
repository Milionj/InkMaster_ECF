#!/bin/bash
# Script pour créer des issues sur GitHub à partir d’un fichier JSON
# Nécessite GitHub CLI (gh) connecté à ton compte

REPO="Milionj/InkMaster_ECF"  # Remplace par ton nom d’utilisateur et nom de dépôt

echo "Création des issues dans $REPO..."

gh issue create --repo "$REPO" --title "US 1 – Page d’accueil" --body "Vitrine du salon avec services et avis clients validés." --label "front,UX"
gh issue create --repo "$REPO" --title "US 2 – Menu de navigation" --body "Menu accessible sur toutes les pages vers accueil, artistes, contact, etc." --label "front,navigation"
gh issue create --repo "$REPO" --title "US 3 – Vue des services" --body "Affichage dynamique des services configurables par l’administrateur." --label "front,back"
gh issue create --repo "$REPO" --title "US 4 – Galerie des artistes" --body "Vue globale + vue détaillée des artistes et de leurs créations." --label "front,media"
gh issue create --repo "$REPO" --title "US 5 – Gestion des avis" --body "Formulaire visiteurs + validation manuelle par l’employé avant affichage." --label "front,back,moderation"
gh issue create --repo "$REPO" --title "US 6 – Espace administrateur" --body "Gestion des comptes artistes, contenus, services et statistiques." --label "admin,back"
gh issue create --repo "$REPO" --title "US 7 – Espace artiste" --body "Zone personnelle pour gérer les créations et voir les avis." --label "front,back,artist"
gh issue create --repo "$REPO" --title "US 8 – Système de connexion" --body "Connexion sécurisée pour artistes et administrateurs (pas d'inscription publique)." --label "auth,security"
gh issue create --repo "$REPO" --title "US 9 – Formulaire de contact" --body "Formulaire pour envoyer un message au salon avec email, titre et description." --label "contact,form"
gh issue create --repo "$REPO" --title "US 10 – Statistiques des artistes" --body "Comptage des vues des profils artistes avec affichage dans le dashboard admin (NoSQL)." --label "stats,NoSQL,admin"
gh issue create --repo "$REPO" --title "Installation Docker" --body "Création des fichiers Docker nécessaires au déploiement de l’app." --label "devops,docker"
gh issue create --repo "$REPO" --title "Création de la base MySQL" --body "Modélisation MCD, MPD + création des scripts SQL." --label "database,MySQL"
gh issue create --repo "$REPO" --title "Création des maquettes et wireframes" --body "3 versions desktop et 3 versions mobile avec la charte graphique." --label "design,UX"
gh issue create --repo "$REPO" --title "Intégration Firebase ou MongoDB" --body "Connexion d’une base NoSQL pour stocker les statistiques." --label "database,NoSQL"
gh issue create --repo "$REPO" --title "Sécurisation des inputs (XSS/SQL injection)" --body "Validation des données côté front-end et back-end." --label "security,validation"
gh issue create --repo "$REPO" --title "Responsive complet" --body "Optimisation de l'affichage pour mobile, tablette et desktop." --label "responsive,UX"
gh issue create --repo "$REPO" --title "Ajout README et documentation technique" --body "Ajout d’un README complet avec instructions de déploiement et archi technique." --label "documentation"