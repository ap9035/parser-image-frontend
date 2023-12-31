FROM node:alpine AS build_stage
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Path: /etc/nginx/conf.d/default.conf
FROM nginx
COPY --from=build_stage /app/build /usr/share/nginx/html
