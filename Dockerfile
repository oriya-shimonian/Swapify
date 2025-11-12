# שלב 1: בנייה של האפליקציה
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install

# שלב 2: הגשת האפליקציה דרך nginx
FROM nginx:alpine

# 🔥 ניפטר מקובץ ברירת המחדל של nginx
RUN rm /etc/nginx/conf.d/default.conf

# 🔁 נעתיק את קבצי ה־build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80