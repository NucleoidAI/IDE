FROM node:18

COPY dist /app/ide
COPY serve.json /app

EXPOSE 80

ENTRYPOINT npx -y serve -n -p 80 /app
