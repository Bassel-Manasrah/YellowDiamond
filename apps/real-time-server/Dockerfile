FROM node:iron-alpine 

WORKDIR /app

COPY package*.json .

RUN npm install

CMD [ "node", "index.js" ]