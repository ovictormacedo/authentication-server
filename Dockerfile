FROM node:15.11.0-alpine3.10

WORKDIR /var/authentication/src

COPY . /var/authentication

RUN cp /var/authentication/.env-production /var/authentication/src/.env 

EXPOSE 3001

RUN npm install

CMD [ "node", "app.js" ]