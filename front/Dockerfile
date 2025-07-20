# Étape 1 : build de l'application
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Étape 2 : serveur NGINX pour servir les fichiers
FROM nginx:alpine

# Copie du build dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie du fichier de config NGINX basique (optionnel)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
