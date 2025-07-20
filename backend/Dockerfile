# Image Node officielle
FROM node:20

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet
COPY . .

# Exposer le port de l'API
EXPOSE 5000

# Lancer le serveur
CMD ["npm", "start"]
