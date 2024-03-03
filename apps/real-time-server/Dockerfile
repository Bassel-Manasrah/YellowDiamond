FROM node:iron-alpine 

WORKDIR /yellow

COPY package*.json .
COPY packages ./packages
COPY apps/real-time-server/package*.json ./apps/app/

RUN npm install

WORKDIR /yellow/apps/app/

COPY apps/real-time-server .

CMD [ "node", "index.js" ]