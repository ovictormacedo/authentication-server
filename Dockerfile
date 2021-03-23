FROM node:15.11.0-alpine3.10

WORKDIR /var/authentication

COPY ./src /var/authentication

RUN npm install

EXPOSE 3001

CMD [ "node", "app.js" ]