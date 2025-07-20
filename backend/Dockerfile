# Image Node officielle
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Installer netcat (nc)
RUN apt-get update && apt-get install -y netcat-openbsd

# Copier wait-for-it.sh
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Exposer le port
EXPOSE 5000

# Démarrer avec wait-for-it pour attendre MySQL
CMD ["/wait-for-it.sh", "db:3306", "--", "npm", "start"]
