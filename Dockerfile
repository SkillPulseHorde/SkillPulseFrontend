# ======= Этап 1: Сборка Angular =======
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект и собираем
COPY . .
RUN npm run build

# ======= Этап 2: NGINX для фронтенда =======
FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем сборку Angular
COPY --from=builder /app/dist/skillpulse/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
