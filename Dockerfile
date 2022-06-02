FROM node:16

COPY build /home/app/ide/
COPY serve.json /home/app/

EXPOSE 3000

ENTRYPOINT npx -y serve -n /home/app/
