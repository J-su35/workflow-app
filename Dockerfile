# Stage 1: Build Angular app
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/workflow-app2/browser/* /usr/share/nginx/html/
EXPOSE 4200

RUN sed -i 's/listen       80;/listen 4200;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
