FROM node:15.11.0-alpine3.10
WORKDIR /var/www/oatuh2/src
COPY . /var/oatuh2
RUN cp -R /var/oatuh2/src /var/www/oatuh2
RUN mv .env-production .env
RUN npm install
EXPOSE 80
CMD ["node", "app.js"]