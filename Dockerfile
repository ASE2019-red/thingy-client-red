FROM node:lts-alpine as build-stage
WORKDIR /app

RUN npm i -g http-server aurelia-cli

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build -- --host 0.0.0.0 --port 80


FROM nginx:alpine as production-stage
WORKDIR /usr/share/nginx/html

COPY --from=build-stage /app/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
