FROM node:iron-alpine 

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]