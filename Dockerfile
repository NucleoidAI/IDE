FROM node:18

WORKDIR /app

COPY dist ./dist
COPY config.js .
COPY package.json .

EXPOSE 80

ENTRYPOINT npx @nucleoidjs/http-server start 
